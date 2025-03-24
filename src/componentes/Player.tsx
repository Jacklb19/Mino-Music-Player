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

interface PlayerProps {
  playlist: Track[];
  currentSongIndex: number | null;
  setCurrentSongIndex: (index: number | null) => void;
}

const Player: React.FC<PlayerProps> = ({ playlist: initialPlaylist, currentSongIndex, setCurrentSongIndex }) => {
  const playlist = useRef(new DoublyLinkedList<Track>());
  const [currentNode, setCurrentNode] = useState<Node<Track> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setRepeat] = useState("repeat-off");
  const [isShuffle, setShuffle] = useState(false);
  const [volume, setVolume] = useState(1);
  const [songCurrentTime, setSongCurrentTime] = useState(0);
  const [songMaxTime, setSongMaxTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    playlist.current = new DoublyLinkedList<Track>();
    initialPlaylist.forEach((track) => playlist.current.append(track));
    if (playlist.current.size() > 0) setCurrentNode(playlist.current.getHead());
  }, [initialPlaylist]); // Se ejecuta cuando cambia la playlist
  

  useEffect(() => {
    if (currentSongIndex !== null && playlist.current.size() > 0) {
      setCurrentNode(playlist.current.getAt(currentSongIndex));
    }
  }, [currentSongIndex]);

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

  const handleRemoveSong = (id: string) => {
    if (playlist.current.size() > 1) {
      playlist.current.remove(playlist.current.findIndex((track: Track) => track.id === id));
  
      if (currentNode?.value.id === id) {
        if (currentNode.next) {
          setCurrentNode(currentNode.next);
          setCurrentSongIndex(currentSongIndex !== null ? currentSongIndex + 1 : 0);
        } else {
          setCurrentNode(playlist.current.getHead());
          setCurrentSongIndex(0);
          setIsPlaying(false);
        }
      }
    }
  };
  

  const handleBackwardClick = () => {
    if (!audioRef.current) return;
  
    if (audioRef.current.currentTime < 4) {
      if (currentNode?.prev) {
        // Si hay una canción anterior, retrocede
        setCurrentNode(currentNode.prev);
        setCurrentSongIndex(currentSongIndex !== null ? currentSongIndex - 1 : 0);
      } else if (isRepeat === "repeat-all") {
        // Si está en la primera canción y repeat-all, ir a la última
        setCurrentNode(playlist.current.getTail());
        setCurrentSongIndex(playlist.current.size() - 1);
      } else {
        // Si está en la primera canción y repeat-off/repeat-1, reinicia la canción
        audioRef.current.currentTime = 0;
      }
    } else {
      // Si la canción ha avanzado más de 4 segundos, solo reiníciala
      audioRef.current.currentTime = 0;
    }
  };
  

  const handleRepeatClick = () => {
    const repeatModes = ["repeat-off", "repeat-all", "repeat-1"];
    setRepeat(repeatModes[(repeatModes.indexOf(isRepeat) + 1) % repeatModes.length]);
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

  // Permitir que el usuario controle la barra de progreso
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


