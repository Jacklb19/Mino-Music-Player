import React from "react";

interface SongProps {
  cover?: string;
  song?: string;
  artist?: string;
}

const Song: React.FC<SongProps> = ({ cover, song, artist }) => {
  const hasSong = song;

  return (
    <div className="text-center p-4 bg-zinc-700 rounded-[35px] w-[90%] md:rounded-[30px] min-h-[250px] flex flex-col justify-center items-center">
      {hasSong ? (
        <>
          <img src={cover} alt={song} className="rounded-xl w-full" />
          <h2 className="text-xl font-bold mt-4">{song}</h2>
          <h3 className="text-gray-400">{artist}</h3>
        </>
      ) : (
        <p className="text-gray-400 text-lg">🎵 Agrega canciones para empezar 🎶</p>
      )}
    </div>
  );
};

export default Song;
