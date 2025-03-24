import { DoublyLinkedList } from "./DoublyLinkedList";

interface Song {
  title: string;
  path: string;
  audio: HTMLAudioElement;
  coverImage: string;
}

export class PlaylistManager {
  private playlist: DoublyLinkedList<Song>;
  private currentSong: Song | null;
  private currentNode: any;

  constructor() {
    this.playlist = new DoublyLinkedList<Song>();
    this.currentSong = null;
    this.currentNode = null;
  }

  // Cargar canciones en la lista
  loadSongs(songs: { title: string; path: string }[]): void {
    songs.forEach((song) => {
      const audio = new Audio(song.path);
      this.playlist.append({
        title: song.title,
        path: song.path,
        audio: audio,
        coverImage: '/default-cover.jpg'
      });
    });
    this.currentNode = this.playlist.getHead();
    this.currentSong = this.currentNode?.value || null;
  }

  // Obtener la canción actual
  getCurrentSong(): Song | null {
    return this.currentSong;
  }

  // Avanzar a la siguiente canción
  nextSong(): void {
    if (this.currentNode?.next) {
      this.currentNode = this.currentNode.next;
      this.currentSong = this.currentNode.value;
      if (this.currentSong) {
        this.currentSong.audio.play();
      }
    }
  }

  // Retroceder a la canción anterior
  prevSong(): void {
    if (this.currentNode?.prev) {
      this.currentNode = this.currentNode.prev;
      this.currentSong = this.currentNode.value;
      if (this.currentSong) {
        this.currentSong.audio.play();
      }
    }
  }

  // Agregar una nueva canción
  addSong(song: { title: string; path: string }): void {
    const audio = new Audio(song.path);
    this.playlist.append({
      title: song.title,
      path: song.path,
      audio: audio,
      coverImage: '/default-cover.jpg'
    });
  }

  // Eliminar una canción por índice
  removeSong(index: number): void {
    this.playlist.remove(index);
  }

  // Reproducir la canción actual
  play(): void {
    if (this.currentSong) {
      this.currentSong.audio.play();
    }
  }

  // Pausar la canción actual
  pause(): void {
    if (this.currentSong) {
      this.currentSong.audio.pause();
    }
  }

  // Obtener el tiempo actual
  getCurrentTime(): number {
    return this.currentSong?.audio.currentTime || 0;
  }

  // Obtener la duración total
  getDuration(): number {
    return this.currentSong?.audio.duration || 0;
  }

  // Establecer el tiempo actual
  seek(time: number): void {
    if (this.currentSong) {
      this.currentSong.audio.currentTime = time;
    }
  }

  // Reproducir una canción específica por índice
  playSpecific(index: number): void {
    let current = this.playlist.getHead();
    for (let i = 0; i < index; i++) {
      if (current?.next) {
        current = current.next;
      }
    }
    if (current) {
      if (this.currentSong) {
        this.currentSong.audio.pause();
      }
      this.currentNode = current;
      this.currentSong = current.value;
      this.currentSong.audio.play();
    }
  }

  setVolume(volume: number): void {
    if (this.currentSong) {
      this.currentSong.audio.volume = volume;
    }
  }
}
