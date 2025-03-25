import React, { useState } from "react";
import ListManager from "./componentes/ListManager";
import Player from "./componentes/Player";
import Song from "./componentes/Song";

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
      // Obtener el índice de la canción a eliminar
      const removedIndex = prev.findIndex((track) => track.id === id);
      if (removedIndex === -1) return prev; // Si no se encontró la canción, no se hace nada
  
      // Actualizar la lista filtrando la canción
      const updatedPlaylist = prev.filter((track) => track.id !== id);
  
      // Caso 1: La canción eliminada es la que se está reproduciendo
      if (currentSongIndex === removedIndex) {
        // Si hay una siguiente canción, se mantiene el mismo índice (la siguiente ocupa ese lugar)
        if (removedIndex < updatedPlaylist.length) {
          setCurrentSongIndex(removedIndex);
        } else {
          // Si la lista quedó vacía o la canción eliminada era la última, se reinicia el índice
          setCurrentSongIndex(null);
        }
      }
      // Caso 2: La canción eliminada está antes de la que se está reproduciendo
      else if (currentSongIndex !== null && currentSongIndex > removedIndex) {
        setCurrentSongIndex(currentSongIndex - 1);
      }
      // Si la canción eliminada está después de la que se está reproduciendo, no se modifica currentSongIndex
  
      return updatedPlaylist;
    });
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#cca469] gap-8 p-8">
      {/* Muestra la información de la canción */}
      <div className="text-center p-4 bg-zinc-700 rounded-[35px] w-[90%] md:rounded-[30px] min-h-[250px] flex flex-col justify-center items-center border--4">
        <Song
          cover={currentTrack?.cover || "/default-cover.jpg"}
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