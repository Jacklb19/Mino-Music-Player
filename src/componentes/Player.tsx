import React, { useState, useEffect, useRef } from "react";
import { DoublyLinkedList, Node } from "../core/DoublyLinkedList";
import PlayerControls from "./PlayerControls";

interface Track {
  id: string;
  src: string;
  song: string;
  artist: string;
  cover: string;
}

type RepeatMode = "repeat-off" | "repeat-all" | "repeat-1";

interface PlayerProps {
  playlist: Track[];
  currentSongIndex: number | null;
  setCurrentSongIndex: (index: number | null) => void;
  isRepeat: RepeatMode;
  setIsRepeat: (repeat: RepeatMode) => void;
}

const Player: React.FC<PlayerProps> = ({
  playlist: initialPlaylist,
  currentSongIndex,
  setCurrentSongIndex,
  isRepeat,
  setIsRepeat,
}) => {
  const playlist = useRef(new DoublyLinkedList<Track>());
  const [currentNode, setCurrentNode] = useState<Node<Track> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setShuffle] = useState(false);
  const [volume, setVolume] = useState(1);
  const [songCurrentTime, setSongCurrentTime] = useState(0);
  const [songMaxTime, setSongMaxTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

// Reemplaza los dos efectos que reconstruyen el DoublyLinkedList y actualizan el currentNode por este efecto combinado:
useEffect(() => {
  // Reconstruir la lista interna
  playlist.current = new DoublyLinkedList<Track>();
  initialPlaylist.forEach((track) => playlist.current.append(track));

  // Actualizar el nodo actual según el currentSongIndex
  if (currentSongIndex !== null && currentSongIndex < playlist.current.size()) {
    setCurrentNode(playlist.current.getAt(currentSongIndex));
  } else if (playlist.current.size() > 0) {
    // Si no hay un índice válido pero la lista no está vacía, se inicia en la primera canción
    setCurrentNode(playlist.current.getHead());
    setCurrentSongIndex(0);
  } else {
    // Si la lista está vacía
    setCurrentNode(null);
  }
}, [initialPlaylist, currentSongIndex]);


  // Play / Pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleForwardClick = () => {
    if (currentNode?.next) {
      setCurrentNode(currentNode.next);
      setCurrentSongIndex(currentSongIndex !== null ? currentSongIndex + 1 : 0);
    } else if (isRepeat === "repeat-all") {
      setCurrentNode(playlist.current.getHead());
      setCurrentSongIndex(0);
    }
  };

  const handleBackwardClick = () => {
    if (!audioRef.current) return;

    if (audioRef.current.currentTime < 4) {
      if (currentNode?.prev) {
        setCurrentNode(currentNode.prev);
        setCurrentSongIndex(currentSongIndex !== null ? currentSongIndex - 1 : 0);
      } else if (isRepeat === "repeat-all") {
        setCurrentNode(playlist.current.getTail());
        setCurrentSongIndex(playlist.current.size() - 1);
      } else {
        audioRef.current.currentTime = 0;
      }
    } else {
      audioRef.current.currentTime = 0;
    }
  };

  const handleRepeatClick = () => {
    const repeatModes: RepeatMode[] = ["repeat-off", "repeat-all", "repeat-1"];
    setIsRepeat(repeatModes[(repeatModes.indexOf(isRepeat) + 1) % repeatModes.length]);
  };

  // Actualización automática del tiempo de reproducción
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const updateTime = () => setSongCurrentTime(Math.floor(audio.currentTime));
      const setMetadata = () => setSongMaxTime(Math.floor(audio.duration));

      audio.ontimeupdate = updateTime;
      audio.onloadedmetadata = setMetadata;

      return () => {
        audio.ontimeupdate = null;
        audio.onloadedmetadata = null;
      };
    }
  }, [currentNode]);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setSongCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  useEffect(() => {
    if (audioRef.current && currentNode) {
      if (audioRef.current.src !== currentNode.value.src) {
        audioRef.current.src = currentNode.value.src;
      }

      audioRef.current.onended = () => {
        if (isRepeat === "repeat-1") {
          audioRef.current!.currentTime = 0;
          audioRef.current!.play();
        } else if (currentNode.next) {
          setCurrentNode(currentNode.next);
          setCurrentSongIndex(currentSongIndex !== null ? currentSongIndex + 1 : 0);
        } else if (isRepeat === "repeat-all") {
          setCurrentNode(playlist.current.getHead());
          setCurrentSongIndex(0);
        } else {
          setIsPlaying(false);
        }
      };

      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentNode, isPlaying, isRepeat]);

  return (
    <div className="flex flex-col items-center p-4 bg-zinc-700 rounded-[35px] w-[90%] md:rounded-[30px]">
      <audio ref={audioRef} />

      {/* Barra de progreso */}
      <input
        type="range"
        min={0}
        max={songMaxTime || 1}
        value={songCurrentTime}
        onChange={handleSeekChange}
        className="w-full mt-2"
      />

      {/* Controles del reproductor */}
      <PlayerControls
        isPlaying={isPlaying}
        isShuffle={isShuffle}
        isRepeat={isRepeat}
        togglePlayPause={togglePlayPause}
        nextTrack={handleForwardClick}
        prevTrack={handleBackwardClick}
        handleShuffleClick={() => setShuffle(!isShuffle)}
        handleRepeatClick={handleRepeatClick}
      />

      {/* Control de volumen */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="mt-2"
      />
    </div>
  );
};

export default Player;