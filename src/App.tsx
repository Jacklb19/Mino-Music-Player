import React, { useState } from "react";
import "./App.css";
import Player from "./componentes/Player";
import ListManager from "./componentes/ListManager";

function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);

  return (
    <div className="App flex flex-col md:flex-row gap-4 p-6">
      <Player currentSongIndex={currentSongIndex} />
      <ListManager onSelectSong={setCurrentSongIndex} />
    </div>
  );
}

export default App;
