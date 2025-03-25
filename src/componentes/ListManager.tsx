import React, { useState, useEffect, useRef } from "react";
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

const ListManager: React.FC<ListManagerProps> = ({
  onSelectSong,
  onAddSongs,
  onRemoveSong,
}) => {
  const [customTracks, setCustomTracks] = useState<Track[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const itemRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  // Arrastrar y soltar
  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (event: React.DragEvent<HTMLLIElement>) => event.preventDefault();
  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const updatedTracks = [...customTracks];
    const [movedTrack] = updatedTracks.splice(draggedIndex, 1);
    updatedTracks.splice(index, 0, movedTrack);
    setCustomTracks(updatedTracks);
    onAddSongs(updatedTracks);
    setDraggedIndex(null);
  };

  // Subir archivos
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newTracks: Track[] = await Promise.all(
      Array.from(files).map(async (file) => {
        try {
          const metadata = await mm.parseBlob(file);
          const title = metadata.common.title || file.name.replace(/\.[^/.]+$/, "");
          const artist = metadata.common.artist || "Desconocido";
          let cover = "/assets/cover-imgs/default.png";

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
            cover: "/assets/cover-imgs/default.png",
          };
        }
      })
    );

    setCustomTracks((prevTracks) => [...prevTracks, ...newTracks]);
    event.target.value = "";
  };

  // Actualizar lista en App.tsx
  useEffect(() => {
    onAddSongs(customTracks);
  }, [customTracks, onAddSongs]);

  // Eliminar canción
  const handleRemove = (id: string) => {
    setCustomTracks((prev) => prev.filter((track) => track.id !== id));
    onRemoveSong(id);
  };

  // Seleccionar canción
  const handleSelect = (id: string) => {
    const indexInPlaylist = customTracks.findIndex((track) => track.id === id);
    if (indexInPlaylist !== -1) {
      onSelectSong(indexInPlaylist);
      itemRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="w-full h-full bg-zinc-900 text-white rounded-xl  transition-all hover:scale-[1.01] p-4 relative drop-shadow-[0px_0px_10px_rgba(0,0,0,1)] 
        md:drop-shadow-[0px_0px_10px_rgba(0,0,0,1)]
        ml:hover:drop-shadow-[0px_0px_15px_rgba(0,0,0,1)]">
      {/* Título y botón + */}
      <div className="flex items-center justify-between mb-4">
        <h2
            className="text-[24px] flex mr-auto items-center font-bold m-4 h-min 
          md:mb-[1px] md:mt-[0] "
          >
            <i className="fa-solid fa-music mx-[15px] text-[24px] "></i>
            Now Playing
        </h2>

        <label
          htmlFor="file-upload"
          className="flex items-center justify-center w-12 h-12 rounded-full
           bg-zinc-800 cursor-pointer hover:bg-gray-600 transition-colors me-6 "
          title="Agregar canciones"
        >
          <span className="text-xl font-bold">+</span>
        </label>
        <input
          id="file-upload"
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
      <hr className="items-center justify-center w-[99%] h-[px] rounded  border-t-[1px] "></hr>
  
      {/* Contenedor "envoltorio" con borde redondeado y overflow-hidden */}
      <div className="rounded-xl overflow-hidden p-2 pt-6">
        {/* Este es el área que hace scroll */}
        <div className="max-h-130 overflow-y-auto custom-scrollbar bg-zinc-900  rounded-[35px]  
            md:rounded-[40px] p-2">
          <ul className="space-y-2  ">
            {customTracks.map((song, index) => (
              <li
                key={song.id}
                ref={(el) => {
                  itemRefs.current[song.id] = el;
                }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`flex items-center gap-3 rounded-lg p-3 transition-all shadow-sm
                            bg-zinc-800 hover:bg-gray-700
                            ${draggedIndex === index ? "opacity-50" : ""}`}
              >
                <div className="flex-1 cursor-pointer" onClick={() => handleSelect(song.id)}>
                  <div className="flex items-center">
                    <img
                      src={song.cover}
                      alt={song.song}
                      className="h-[50px] object-contain rounded-[10px]"
                    />
                    <div className="pl-[12px] pt-[5px] text-[14px] font-regular  ">
                      <p className="text-[20px] font-semibold text-gray-200 leading-tight">{song.song}</p>
                      <p className="text-[12px] pt-[4px] font-regular text-gray-400">{song.artist}</p>
                    </div>
                  </div>
                </div>
  
                {customTracks.length > 1 && (
                  <button
                    onClick={() => handleRemove(song.id)}
                    className=" bg-zinc-900 hover:text-red-400 transition-all"
                    title="Eliminar canción"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}  

export default ListManager;
