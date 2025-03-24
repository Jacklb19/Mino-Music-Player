import React, { useState } from "react";
import ListManager from "./componentes/ListManager";
import Player from "./componentes/Player";

interface Track {
  id: string;
  src: string;
  song: string;
  artist: string;
  cover: string;
}

const App: React.FC = () => {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);

  // Agregar canciones a la playlist
  const handleAddSongs = (songs: Track[]) => {
    setPlaylist((prev) => [...prev, ...songs]);
  };

  // Seleccionar canción
  const handleSelectSong = (index: number) => {
    setCurrentSongIndex(index);
  };

  // Eliminar canción de la playlist
  const handleRemoveSong = (id: string) => {
    setPlaylist((prev) => prev.filter((track) => track.id !== id));

    if (playlist[currentSongIndex!]?.id === id) {
      setCurrentSongIndex(null); // Detener la reproducción si la canción en curso se elimina
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#cca469] gap-8 p-8">
      <div className="w-[80%] flex flex-col justify-center items-center md:gap-1 ">
        <Player 
          playlist={playlist} 
          currentSongIndex={currentSongIndex} 
          setCurrentSongIndex={setCurrentSongIndex} 
        />
      </div>
      <div className="w-[80%] flex flex-col justify-center items-center md:gap-2 ">
        <ListManager 
          onSelectSong={handleSelectSong} 
          onAddSongs={handleAddSongs} 
          onRemoveSong={handleRemoveSong} 
        />
      </div>
    </div>
  );
};

export default App;
