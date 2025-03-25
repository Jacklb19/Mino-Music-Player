import React, { useState } from "react";
import ListManager from "./componentes/ListManager";
import Player from "./componentes/Player";
import Song from "./componentes/Song";
import { Buffer } from "buffer";
(window as any).Buffer = Buffer;

interface Track {
  id: string;
  src: string;
  song: string;
  artist: string;
  cover: string;
}

type RepeatMode = "repeat-off" | "repeat-all" | "repeat-1";

const App: React.FC = () => {
  const [playlist, setPlaylist] = useState<Track[]>([]); // Lista de canciones
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null); // Índice de la canción actual
  const [isRepeat, setIsRepeat] = useState<RepeatMode>("repeat-off"); // Estado de repetición

  // Obtener la canción actual
  const currentTrack = currentSongIndex !== null ? playlist[currentSongIndex] : null;

  // Manejo de selección de canción
  const handleSelectSong = (index: number) => {
    setCurrentSongIndex(index);
  };

  // Manejo de agregar canciones
  const handleAddSongs = (songs: Track[]) => {
    setPlaylist(songs);
  };

  // Manejo de eliminación de canciones
  const handleRemoveSong = (id: string) => {
    setPlaylist((prev) => {
      // Si solo queda una canción, no permitir eliminarla
      if (prev.length === 1) {
        alert("No puedes eliminar la última canción de la lista.");
        return prev;
      }
  
      // Obtener el índice de la canción a eliminar
      const removedIndex = prev.findIndex((track) => track.id === id);
      if (removedIndex === -1) return prev;
  
      // Filtrar la canción eliminada
      const updatedPlaylist = prev.filter((track) => track.id !== id);
  
      // Ajustar el índice de la canción actual
      if (currentSongIndex === removedIndex) {
        if (removedIndex < updatedPlaylist.length) {
          setCurrentSongIndex(removedIndex);
        } else {
          setCurrentSongIndex(null);
        }
      } else if (currentSongIndex !== null && currentSongIndex > removedIndex) {
        setCurrentSongIndex(currentSongIndex - 1);
      }
  
      return updatedPlaylist;
    });
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#cca469] gap-8 p-8">
      {/* Muestra la información de la canción */}
      <div className="text-center p-4 bg-zinc-700 rounded-[35px] w-[90%] md:rounded-[30px] min-h-[250px] flex flex-col justify-center items-center border--4">
        <Song
          cover={currentTrack?.cover || "/assets/cover-imgs/default.png"}
          song={currentTrack?.song || "No hay canción seleccionada"}
          artist={currentTrack?.artist || "Desconocido"}
        />
      </div>

      {/* Controles del reproductor */}
      <div className="w-[80%] flex flex-col justify-center items-center md:gap-2">
        <Player
          playlist={playlist}
          currentSongIndex={currentSongIndex}
          setCurrentSongIndex={setCurrentSongIndex}
          isRepeat={isRepeat}
          setIsRepeat={setIsRepeat}
        />
      </div>

      {/* Lista de canciones */}
      <div className="w-[80%] flex flex-col justify-center items-center md:gap-3">
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
