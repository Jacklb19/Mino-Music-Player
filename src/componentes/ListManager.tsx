import React, { useState } from "react";

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
}

const ListManager: React.FC<ListManagerProps> = ({ onSelectSong, onAddSongs }) => {
  const [customTracks, setCustomTracks] = useState<Track[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
  
    const newTracks: Track[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(), // Generar un ID único para cada canción
      src: URL.createObjectURL(file), // Cargar archivo localmente
      song: file.name.replace(/\.[^/.]+$/, ""), // Nombre sin extensión
      artist: "Desconocido",
      cover: "/default-cover.jpg", // Imagen por defecto
    }));
  
    setCustomTracks((prev) => [...prev, ...newTracks]);
    onAddSongs(newTracks); // Pasar las canciones a `Player.tsx`
  };
  

  return (
    <div className="w-full p-4 bg-gray-900 text-white rounded-xl">
      <h2 className="text-xl font-semibold mb-3">Lista de Reproducción</h2>
      
      {/* Botón para seleccionar archivos */}
      <input type="file" accept="audio/*" multiple onChange={handleFileUpload} className="mb-3" />

      {/* Lista de canciones */}
      <ul className="space-y-2">
        {customTracks.map((song, index) => (
          <li
            key={index}
            className="flex items-center gap-3 p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
            onClick={() => onSelectSong(index)}
          >
            <img src={song.cover} alt={song.song} className="w-12 h-12 rounded-lg" />
            <div>
              <p className="font-semibold">{song.song}</p>
              <p className="text-sm text-gray-400">{song.artist}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListManager;
