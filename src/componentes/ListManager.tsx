import React from "react";
import { tracks } from "../data/data";

interface ListManagerProps {
  onSelectSong: (index: number) => void;
}

const ListManager: React.FC<ListManagerProps> = ({ onSelectSong }) => {
  return (
    <div className="w-full p-4 bg-gray-900 text-white rounded-xl">
      <h2 className="text-xl font-semibold mb-3">Lista de Reproducción</h2>
      <ul className="space-y-2">
        {tracks.map((song, index) => (
          <li
            key={song.id}
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
