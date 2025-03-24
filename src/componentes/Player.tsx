import React, { useState, useEffect, useRef } from "react";
import { DoublyLinkedList, Node } from "../core/DoublyLinkedList";
import tracks from "../data/data";
import PlayerControls from "./PlayerControls";

const Player: React.FC<{ currentSongIndex: number | null }> = ({ currentSongIndex }) => {
  const playlist = useRef(new DoublyLinkedList<typeof tracks[number]>());
  const [currentNode, setCurrentNode] = useState<Node<typeof tracks[number]> | null>(null);

  // Estados del reproductor
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setRepeat] = useState("repeat-off");
  const [isShuffle, setShuffle] = useState(false);
  const [volume, setVolume] = useState(1);
  const [songCurrentTime, setSongCurrentTime] = useState(0);
  const [songMaxTime, setSongMaxTime] = useState(0);

  // Referencia al audio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Llenar la lista de reproducción al montar
  useEffect(() => {
    if (playlist.current.getHead() === null) {
      tracks.forEach((track) => playlist.current.append(track));
    }
  }, []);

  // Cambiar de canción cuando el índice cambia
  useEffect(() => {
    if (currentSongIndex !== null && currentSongIndex >= 0 && currentSongIndex < tracks.length) {
      setCurrentNode(playlist.current.getAt(currentSongIndex));
    }
    if (!currentNode) {
      setCurrentNode(playlist.current.getHead());
    }
  }, [currentSongIndex]);

  // Play / Pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Canción siguiente
  const nextTrack = () => {
    if (currentNode?.next) {
      setCurrentNode(currentNode.next);
    } else if (isRepeat === "repeat-all") {
      setCurrentNode(playlist.current.getHead());
    }
  };

  // Canción anterior
  const prevTrack = () => {
    if (audioRef.current) {
      if (audioRef.current.currentTime > 2) {
        audioRef.current.currentTime = 0;
      } else if (currentNode?.prev) {
        setCurrentNode(currentNode.prev);
      }
    }
  };

  // Shuffle
  const handleShuffleClick = () => setShuffle(!isShuffle);

  // Repeat
  const handleRepeatClick = () => {
    const repeatModes = ["repeat-off", "repeat-all", "repeat-1"];
    const nextMode = repeatModes[(repeatModes.indexOf(isRepeat) + 1) % repeatModes.length];
    setRepeat(nextMode);
  };

  // Manejo del tiempo de la canción
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

  // Manejo del volumen
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

// Cambio de canción cuando el nodo cambia
useEffect(() => {
  if (audioRef.current && currentNode) {
    audioRef.current.src = currentNode.value.src;

    audioRef.current.onended = () => {
      if (isRepeat === "repeat-1") {
        // Repetir la misma canción
        audioRef.current!.currentTime = 0;
        audioRef.current!.play();
      } else if (currentNode.next) {
        // Ir a la siguiente canción si hay una disponible
        setCurrentNode(currentNode.next);
      } else if (isRepeat === "repeat-all") {
        // Volver a la primera canción si se repite toda la lista
        setCurrentNode(playlist.current.getHead());
      } else {
        // Modo "repeat-off": Volver a la primera pero sin reproducir automáticamente
        setCurrentNode(playlist.current.getHead());
        setIsPlaying(false);
      }
    };

    if (isPlaying) {
      audioRef.current.play();
    }
  }
}, [currentNode]);


  // Cambio de tiempo con la barra de progreso
  const handleInputRange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const audioPosition = parseFloat(event.target.value);
      audioRef.current.currentTime = audioPosition;
      setSongCurrentTime(audioPosition);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#502626] gap-8 p-8">
      {/* Reproductor de música */}
      <div className="overflow-hidden bg-zinc-700 rounded-[35px] w-[90%] md:rounded-[30px]">
        {currentNode ? (
          <>
            <img src={currentNode.value.cover} alt={currentNode.value.song} className="rounded-xl w-full" />
            <h2 className="text-xl font-bold mt-4">{currentNode.value.song}</h2>
            <h3 className="text-gray-400">{currentNode.value.artist}</h3>
            <audio ref={audioRef} />

            {/* Barra de progreso */}
            <input
              type="range"
              min={0}
              max={songMaxTime}
              value={songCurrentTime}
              onChange={handleInputRange}
              className="w-full mt-2"
            />

            {/* Controles del reproductor */}
            <PlayerControls
              isPlaying={isPlaying}
              isShuffle={isShuffle}
              isRepeat={isRepeat}
              togglePlayPause={togglePlayPause}
              nextTrack={nextTrack}
              prevTrack={prevTrack}
              handleShuffleClick={handleShuffleClick}
              handleRepeatClick={handleRepeatClick}
            />

            {/* Control de volumen */}
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="mt-2" />
          </>
        ) : (
          <p>No songs available</p>
        )}
      </div>
    </div>
  );
};

export default Player;
