import React from "react";

interface SongProps {
  cover?: string;
  song?: string;
  artist?: string;
}

const Song: React.FC<SongProps> = ({ cover, song, artist }) => {
  return (
    // Caja exterior sin márgenes externos para que respete el contenedor padre
    <div className="w-full flex flex-col justify-start items-center bg-zinc-900 h-[490px]
       rounded-[35px] transition-all hover:scale-[1.01] mb-6 md:mb-0 
       drop-shadow-[0px_0px_10px_rgba(0,0,0,1)] 
        md:drop-shadow-[0px_0px_10px_rgba(0,0,0,1)]
        ml:hover:drop-shadow-[0px_0px_15px_rgba(0,0,0,1)]">
      {song ? (
        <>
          <img 
            src={cover && cover !== "" ? cover : "/assets/cover-imgs/default.png"} 
            alt={song} 
            className="rounded-xl w-full max-h-60 object-cover"
          />
          <h2 className="text-xl font-bold mt-4 text-white">{song}</h2>
          <h3 className="text-gray-400">{artist || "Desconocido"}</h3>
        </>
      ) : (
        <p className="text-gray-400 text-lg">🎵 Agrega canciones para empezar 🎶</p>
      )}
    </div>
  );
};

export default Song;
