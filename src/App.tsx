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
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [isRepeat, setIsRepeat] = useState<RepeatMode>("repeat-off");

  // Obtener la canción actual
  const currentTrack = currentSongIndex !== null ? playlist[currentSongIndex] : null;

  // Manejo de selección, agregado y eliminación de canciones
  const handleSelectSong = (index: number) => setCurrentSongIndex(index);
  const handleAddSongs = (songs: Track[]) => setPlaylist(songs);
  const handleRemoveSong = (id: string) => {
    setPlaylist((prev) => {
      if (prev.length === 1) {
        alert("No puedes eliminar la última canción de la lista.");
        return prev;
      }
      const removedIndex = prev.findIndex((track) => track.id === id);
      if (removedIndex === -1) return prev;
      const updatedPlaylist = prev.filter((track) => track.id !== id);
      if (currentSongIndex === removedIndex) {
        setCurrentSongIndex(removedIndex < updatedPlaylist.length ? removedIndex : null);
      } else if (currentSongIndex !== null && currentSongIndex > removedIndex) {
        setCurrentSongIndex(currentSongIndex - 1);
      }
      return updatedPlaylist;
    });
  };

  return (
    <div className="flex flex-col md:flex-row bg-orange-2000 gap-0.5 p-9 pt-10">
      {/* IZQUIERDA: Lista de Reproducción */}
      <div className="md:w-3/7 ">
        <ListManager
          onSelectSong={handleSelectSong}
          onAddSongs={handleAddSongs}
          onRemoveSong={handleRemoveSong}
        />
      </div>

      {/* DERECHA: Carátula arriba y barra abajo */}
      <div className="md:w-4/7 w-full flex flex-col items-center gap-6 ">
        {/* Carátula / Información de la canción */}
        <div className="w-full px-4">
          <Song
            cover={currentTrack?.cover || "/assets/cover-imgs/default.png"}
            song={currentTrack?.song || "No hay canción seleccionada"}
            artist={currentTrack?.artist || "Desconocido"}
          />
        </div>

        {/* Barra del reproductor */}
        <div className="w-full px-4">
          <Player
            playlist={playlist}
            currentSongIndex={currentSongIndex}
            setCurrentSongIndex={setCurrentSongIndex}
            isRepeat={isRepeat}
            setIsRepeat={setIsRepeat}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
