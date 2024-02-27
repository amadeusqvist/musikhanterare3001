import { Queue, empty as emptyQueue, is_empty as is_empty_queue, dequeue, head as qhead } from './lib/queue_array';
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
    collaborators: Array<string>
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

interface SongDatabase {
    songs: Record<string, Song>;
};


type SongQueue = Queue<Song>;


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
function addSong(playlist: Playlist, searchTerm: string, songDatabase: SongDatabase): Playlist {
    const updatedSongs = playlist.songs.concat();
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
    playlist.currentSongIndex = 0;

    console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');
  
    return playlist;
}

function playSpecificSong(playlist: Playlist, songIndex: number): Playlist {

    console.log('${playlist.name}')
    for (let i = 0; i < playlist.songs.length; i = i + 1) {
        console.log('[${i}]. ${playlist.songs[i].title} - ${playlist.songs[i].artist}');
    }

  
    const userInput = prompt('Enter the number of the song you wish to play: ');
    const songNumber = parseInt(userInput);

    if (isNaN(songNumber) || songNumber < 1 || songNumber > playlist.songs.length) {
        console.log('Invalid song number.');
        return playlist;
    }

    // Set the current song index
    const currentSongIndex = songNumber - 1;
    const currentSong = playlist.songs[currentSongIndex];

    // Display currently playing song
    console.log('Currently playing: ${currentSong.title} - ${currentSong.artist}');

    return { ...playlist, currentSongIndex };  
}

/**
 * Plays the next song in the playlist.
 * @param playlist - The playlist.
 */
function playNextSong(playlist: Playlist, songQueue: SongQueue): Playlist {
    if (is_empty_queue(songQueue)) {
        const currentIndex = playlist.currentSongIndex;
        if (playlist.songs[currentIndex] === playlist.songs[-1]) {
            const currentIndex = 0;
            const currentSong = playlist.songs[currentIndex];

            console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');

            return {...playlist, currentSongIndex: currentIndex};
        } else {
			const currentSong = playlist.songs[currentIndex + 1];
            console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');

            return {...playlist, currentSongIndex: currentIndex + 1};
        }

    
    } else {
		const currentSong = qhead(songQueue);
        dequeue(songQueue);
        console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');
        return playlist;
    }
}

/**
 * Plays the previous song in the playlist.
 * @param playlist - The playlist.
 */
function playPreviousSong(playlist: Playlist): Playlist {
	if (playlist.currentSongIndex === 0) {
    	const currentIndex = playlist.songs.length;
    	const currentSong = playlist.songs[currentIndex];
    	console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');
    	return {...playlist, currentSongIndex: currentIndex}
  	} else {
    	const currentIndex = playlist.currentSongIndex - 1;
    	const currentSong = playlist.songs[currentIndex];
    	console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');
    	return {...playlist, currentSongIndex: currentIndex}
  	}    
}

/**
 * Searches the database for songs.
 * @param database - The songdatabase.
 * @param searchTerm - The searchterm may be the title or the artist
 * @returns An array of songs matching the search criteria.
 */
function searchSongDatabase(songDatabase: SongDatabase, searchTerm: string): Array<Song> {
    const matchingSongs: Song[] = [];
    const lowercaseSearchTerm = searchTerm.toLowerCase();

    for (const songId in songDatabase.songs) {
        const song = songDatabase.songs[songId];
        const lowercaseTitle = song.title.toLowerCase();
        const lowercaseArtist = song.artist.toLowerCase();

        if (
            lowercaseTitle.includes(lowercaseSearchTerm, undefined) ||
            lowercaseArtist.includes(lowercaseSearchTerm) ||
            song.collaborators.some(collaborator =>
                collaborator.toLowerCase().includes(lowercaseSearchTerm)
            )
        ) {
            matchingSongs.push(song);
        }
    }

    return matchingSongs;
}

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


