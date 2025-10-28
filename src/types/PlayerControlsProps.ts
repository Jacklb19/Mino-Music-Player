export default interface PlayerControlsProps {
  isPlaying: boolean;
  isRepeat: string;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  handleShuffleClick: () => void;  
  handleRepeatClick: () => void;
}
