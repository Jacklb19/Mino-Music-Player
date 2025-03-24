import React, { useState } from "react";
import "./App.css";
import Player from "./componentes/Player";
import ListManager from "./componentes/ListManager";

function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#cca469] gap-8 p-8">
      <div className="w-[80%] flex flex-col justify-center items-center md:gap-1 ">
      <Player currentSongIndex={currentSongIndex} />
      </div>
      <div className="w-[80%] flex flex-col justify-center items-center md:gap-2 ">
      <ListManager onSelectSong={setCurrentSongIndex} />
      </div>
    </div>
  );
}

export default App;
