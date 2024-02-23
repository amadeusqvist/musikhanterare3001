import { Queue, empty as emptyQueue } from './lib/queue_array';
import {type List} from './lib/list';
import { type Stack, push} from './lib/stack';
import * as PromptSync from "prompt-sync";

const prompt: PromptSync.Prompt = PromptSync({sigint:true});

/**
 * Stores information about a song including title, artist, and album if any.
 */
type Song = {
  title: string;
  artist: string;
  album: string;
  collaborators: List<string>
};

/**
 * Stores songs, history for navigating backward and forward, the queue for
 * queuing songs, and the index of the currently playing song.
 */
type Playlist =  { 
  name: string;
  songs: Array<Song>;
  currentSongIndex: number; 
}

type songQueue = Queue<Song>;

/**
 * Creates a fresh playlist.
 * @returns An empty playlist.
 */
function createEmptyPlaylist(nameOfPlaylist: string): Playlist {
  return {
    name: nameOfPlaylist,
    songs: [],
    currentSongIndex: -1,
  };
}

/**
 * Adds a song to the playlist.
 * @precondition The song is not empty.
 * @param playlist - The playlist.
 * @param song - The song to be added.
 * @returns The updated playlist.
 */
function addSong(playlist: Playlist, song: Song): Playlist {
  const updatedSongs = playlist.songs.concat(song);
  return { ...playlist, songs: updatedSongs };
}

/**
 * Removes a song from the playlist.
 * @precondition The songIndex is smaller than the length of the playlist.
 * @param playlist - The playlist.
 * @param songIndex - The index of the song to be removed.
 * @returns The updated playlist.
 */
function removeSong(playlist: Playlist, songIndex: number): Playlist {
  const updatedSongs = [
    ...playlist.songs.slice(0, songIndex),
    ...playlist.songs.slice(songIndex + 1)
  ];
  return { ...playlist, songs: updatedSongs };
}

/**
 * Always plays the first song in the playlist.
 * @param playlist - The playlist.
 */
function playPlaylist(playlist: Playlist): Playlist {
  if (playlist.songs === null) {
    console.log('Playlist is empty');
    return playlist;
  }

  const currentSong = playlist.songs[0];

  console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');
  
  return playlist;
}

function playSong(playlist: Playlist, songIndex: number): Playlist {

}

/**
 * Plays the next song in the playlist.
 * @param playlist - The playlist.
 */
function playNextSong(playlist: Playlist): void {
  // Implemented  
}

/**
 * Plays the previous song in the playlist.
 * @param playlist - The playlist.
 */
function playPreviousSong(playlist: Playlist): void {    
    
}

/**
 * Searches the playlist for songs.
 * @param playlist - The playlist.
 * @returns An array of songs matching the search criteria.
 */
function searchPlaylist(playlist: Playlist, searchTerm: string): Array<Song> {
  
}

function driver_loop(): void {
   const input = user
}

console.log('1. Välj spellista')
console.log('2. Skapa ny spellista')


console.log('1. Lägg till låt')
console.log('2. Ta bort låt')
console.log('3. Spela låt')
console.log('4. Spela nästa låt')
console.log('5. Spela föregående låt')
console.log('6. Köa låt')


// Shuffel och sökning ska vara på plats

// Josn låtar och artister

// Testfall för sökning

// Shuffel för test

// En bra LaTeX

// DOKUMENTATION I LATEX

// Byta ordning

// Byta mellan olika

// Lägga till flera låtar

// Shuffla spelista, kön

// Om man både vill ha snabb sök och upplslag på låtar och skulle spara det i olika tabeller, 
// nackdelen är att man duplicerar datan och den sparas på två ställen. Säga att spotify tar bort en artist
// från spotify så måste de ta bort från flera ställen. Enkelt att hitta datan genom att duplicera data.
// Hårdkorda alla tabeller i en json fil

// Sök funktioner, artister

// Spara era egna testfall som skrivs under projketets gång så att ni kan använda de sen 

// Funktionalitteten av hela koden ska ju beskrivas övergripande, och ni har

// Vi ska ha kommit långt

// Programma


// En terminal loop med en meny
