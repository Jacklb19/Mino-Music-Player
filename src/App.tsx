import React, { useState } from "react";
import "./App.css";
import Player from "./componentes/Player";
import ListManager from "./componentes/ListManager";
import Track from "./types/Track";  // ✅ IMPORTACIÓN CORRECTA

function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);

  const handleAddSongs = (newSongs: Track[]) => {
    setPlaylist((prev) => [...prev, ...newSongs]); // Agregar nuevas canciones a la lista
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
      <ListManager onSelectSong={setCurrentSongIndex} onAddSongs={handleAddSongs} />
      </div>
    </div>
  );  
}

export default App;
