import React, { useState } from "react";
import { Trash2 } from "lucide-react"; // Icono de eliminación

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
  onRemoveSong: (id: string) => void; // Nueva función para eliminar canción
}

const ListManager: React.FC<ListManagerProps> = ({ onSelectSong, onAddSongs, onRemoveSong }) => {
  const [customTracks, setCustomTracks] = useState<Track[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newTracks: Track[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      src: URL.createObjectURL(file),
      song: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Desconocido",
      cover: "/default-cover.jpg",
    }));

    setCustomTracks((prev) => [...prev, ...newTracks]);
    onAddSongs(newTracks);
  };

  const handleRemove = (id: string) => {
    if (customTracks.length > 1) {
      setCustomTracks((prev) => prev.filter((track) => track.id !== id));
      onRemoveSong(id);
    }
  };
  return (
    <div className="w-full p-4 bg-gray-900 text-white rounded-xl">
      <h2 className="text-xl font-semibold mb-3">Lista de Reproducción</h2>

      {/* Botón para seleccionar archivos */}
      <input type="file" accept="audio/*" multiple onChange={handleFileUpload} className="mb-3" />

      {/* Lista de canciones */}
      <ul className="space-y-2">
        {customTracks.map((song, index) => (
          <li key={song.id} className="flex items-center gap-3 p-2 bg-gray-800 rounded-lg">
            <img
              src={song.cover}
              alt={song.song}
              className="w-12 h-12 rounded-lg cursor-pointer"
              onClick={() => onSelectSong(index)}
            />
            <div className="flex-1 cursor-pointer" onClick={() => onSelectSong(index)}>
              <p className="font-semibold">{song.song}</p>
              <p className="text-sm text-gray-400">{song.artist}</p>
            </div>
            <button onClick={() => handleRemove(song.id)} className="text-red-500 hover:text-red-400">
              <Trash2 size={20} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListManager;
