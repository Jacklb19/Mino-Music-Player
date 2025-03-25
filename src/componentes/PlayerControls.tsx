import React from "react";
import PlayerControlsProps from "../types/PlayerControlsProps";

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isShuffle,
  isRepeat,
  togglePlayPause,
  nextTrack,
  prevTrack,
  handleShuffleClick,
  handleRepeatClick,
}) => {
  return (
    <div className="h-auto w-full flex justify-center items-center gap-4">
      {/* Shuffle */}
      <button onClick={handleShuffleClick} className="w-8 h-8">
        {/*<img src="/assets/icons/shuffle-icon.png" alt="shuffle-icon" 
        className={`h-[20px] object-cover invert hover:scale-105 ${isShuffle ? "" : "opacity-50"}`} />*/}
      </button>

      {/* Canción anterior */}
      <button onClick={prevTrack} className="w-8 h-8">
        <img src="/assets/icons/backward-icon.png" alt="backward-icon" 
        className="w-6 h-6 object-contain hover:scale-110 transition-transform" />
      </button>

      {/* Play/Pause */}
      <button onClick={togglePlayPause} className="w-10 h-10">
        <img src={isPlaying ? "/assets/icons/pause-icon.png" : "/assets/icons/play-icon.png"} 
        alt="play-icon" className="w-8 h-8 object-contain hover:scale-110 transition-transform" />
      </button>

      {/* Canción siguiente */}
      <button onClick={nextTrack} className="w-8 h-8">
        <img src="/assets/icons/forward-icon.png" alt="forward-icon" 
        className="w-6 h-6 object-contain hover:scale-110 transition-transform" />
      </button>

      {/* Repetir */}
      <button onClick={handleRepeatClick} className="w-8 h-8">
        {isRepeat === "repeat-off" ? (
          <img src="/assets/icons/repeat-icon.png" alt="repeat-icon" 
          className="w-6 h-6 object-contain hover:scale-110 transition-transform opacity-50" />
        ) : isRepeat === "repeat-all" ? (
          <img src="/assets/icons/repeat-icon.png" alt="repeat-icon" 
          className="w-6 h-6 object-contain hover:scale-110 transition-transform" />
        ) : (
          <img src="/assets/icons/repeat-1-icon.png" alt="repeat-1-icon" 
          className="w-6 h-6 object-contain hover:scale-110 transition-transform" />
        )}
      </button>
    </div>
  );
};

export default PlayerControls;
