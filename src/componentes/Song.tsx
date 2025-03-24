import React from "react";

interface SongProps {
  cover: string;
  song: string;
  artist: string;
}

const Song: React.FC<SongProps> = ({ cover, song, artist }) => {
  return (
    <div className="text-center p-4  bg-zinc-700 rounded-[35px] w-[90%] md:rounded-[30px]">
      <img src={cover} alt={song} className="rounded-xl w-full" />
      <h2 className="text-xl font-bold mt-4">{song}</h2>
      <h3 className="text-gray-400">{artist}</h3>
    </div>
  );
};

export default Song;
