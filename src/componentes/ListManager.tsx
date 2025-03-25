import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import * as mm from "music-metadata-browser";

interface Track {
  id: string;
  src: string;
  song: string;
  artist: string;
  cover: string;
}

interface ListManagerProps {
  onSelectSong: (index: number) => void;
  onAddSongs: (songs: Track[]) => void;
  onRemoveSong: (id: string) => void;
}

const ListManager: React.FC<ListManagerProps> = ({ onSelectSong, onAddSongs, onRemoveSong }) => {
  const [customTracks, setCustomTracks] = useState<Track[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Manejo de arrastrar y soltar
  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (event: React.DragEvent<HTMLLIElement>) => event.preventDefault();

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedTracks = [...customTracks];
    const [movedTrack] = updatedTracks.splice(draggedIndex, 1);
    updatedTracks.splice(index, 0, movedTrack);

    setCustomTracks(updatedTracks);
    onAddSongs(updatedTracks); // Actualizar la lista en el Player
    setDraggedIndex(null);
  };

  // Manejo de subida de archivos
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newTracks: Track[] = await Promise.all(
      Array.from(files).map(async (file) => {
        try {
          const metadata = await mm.parseBlob(file);
          const title = metadata.common.title || file.name.replace(/\.[^/.]+$/, "");
          const artist = metadata.common.artist || "Desconocido";
          let cover = "/default-cover.jpg";

          if (metadata.common.picture?.length) {
            const picture = metadata.common.picture[0];
            const blob = new Blob([picture.data], { type: picture.format });
            cover = URL.createObjectURL(blob);
          }

          return {
            id: crypto.randomUUID(),
            src: URL.createObjectURL(file),
            song: title,
            artist: artist,
            cover: cover,
          };
        } catch (error) {
          console.error("Error al leer metadatos:", error);
          return {
            id: crypto.randomUUID(),
            src: URL.createObjectURL(file),
            song: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Desconocido",
            cover: "/default-cover.jpg",
          };
        }
      })
    );

    setCustomTracks((prevTracks) => {
      const updatedTracks = [...prevTracks, ...newTracks];
      onAddSongs(updatedTracks); // Actualizar la lista en el Player
      return updatedTracks;
    });
    event.target.value = ""
  };

  // Manejo de eliminación de canciones
  const handleRemove = (id: string) => {
    setCustomTracks((prev) => prev.filter((track) => track.id !== id));
    onRemoveSong(id);
  };

  // Manejo de selección de canciones
  const handleSelect = (id: string) => {
    const indexInPlaylist = customTracks.findIndex((track) => track.id === id);
    if (indexInPlaylist !== -1) {
      onSelectSong(indexInPlaylist);
    }
  };

  return (
    <div className="w-full p-5 bg-gray-900 text-white rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Lista de Reproducción</h2>

      {/* Input para subir archivos */}
      <input
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFileUpload}
        className="mb-4 p-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300 cursor-pointer transition-all hover:bg-gray-700"
      />

      {/* Lista de canciones */}
      <ul className="space-y-3">
        {customTracks.map((song, index) => (
          <li
            key={song.id}
            className={`flex items-center gap-3 p-3 bg-gray-800 rounded-lg transition-all 
              ${draggedIndex === index ? "opacity-50" : "hover:shadow-lg hover:bg-gray-700"}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
          >
            {/* Imagen de la canción */}
            <img
              src={song.cover}
              alt={song.song}
              className="w-12 h-12 rounded-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleSelect(song.id)}
            />

            {/* Información de la canción */}
            <div className="flex-1 cursor-pointer" onClick={() => handleSelect(song.id)}>
              <p className="font-semibold text-gray-200">{song.song}</p>
              <p className="text-sm text-gray-400">{song.artist}</p>
            </div>

            {/* Botón de eliminar */}
            {customTracks.length > 1 && (
              <button
                onClick={() => handleRemove(song.id)}
                className="text-red-500 hover:text-red-400 transition-all"
              >
                <Trash2 size={20} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListManager;