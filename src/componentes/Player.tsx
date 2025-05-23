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

  useEffect(() => {
    playlist.current = new DoublyLinkedList<Track>();
    initialPlaylist.forEach((track) => playlist.current.append(track));

    if (currentSongIndex !== null && currentSongIndex < playlist.current.size()) {
      setCurrentNode(playlist.current.getAt(currentSongIndex));
    } else if (playlist.current.size() > 0) {
      setCurrentNode(playlist.current.getHead());
      setCurrentSongIndex(0);
    } else {
      setCurrentNode(null);
    }
  }, [initialPlaylist, currentSongIndex, setCurrentSongIndex]);

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
  }, [currentNode, isPlaying, isRepeat, currentSongIndex, setCurrentSongIndex]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="w-full flex flex-col justify-center items-center bg-zinc-900 rounded-[35px] 
     transition-all hover:scale-[1.01] p-4 drop-shadow-lg">
      <audio ref={audioRef} />

      {/* Barra de progreso con tiempos */}
      <div className="w-full flex items-center justify-center gap-4">
        <span className="text-white text-sm">{formatTime(songCurrentTime)}</span>
        <input
          type="range"
          min={0}
          max={songMaxTime || 1}
          value={songCurrentTime}
          onChange={handleSeekChange}
          className="w-full"
        />
        <span className="text-white text-sm">{formatTime(songMaxTime)}</span>
      </div>

      {/* Controles del reproductor */}
      <div className="flex justify-center items-center w-full mt-2">
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
      </div>

      {/* Control de volumen */}
      <div className="w-full flex justify-center items-center mt-2">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-1/4"
        />
      </div>
    </div>
  );
};

export default Player;
