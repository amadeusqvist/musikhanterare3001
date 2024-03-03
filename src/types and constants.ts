import { loadPlaylists, loadSongs } from "./controllers/helperFunctions";
import * as readline from 'readline';

/**
 * Represents the structure of a song with title, artist, album, and collaborators.
 */
export type Song = {
    title: string;
    artist: string;
    album: string;
    collaborators: Array<string>; 
};

/**
 * Represents the structure of a Song Database containing an array of songs.
 */
export type SongDatabase = {
    songs: Array<Song>;
};

/**
 * Represents the structure of a playlist with a name, array of songs, and current song index.
 */
export type Playlist = {
    name: string;
    songs: Array<Song>;
    currentSongIndex: number;
};

/**
 * Represents the structure of a Playlist Database with playlist names as keys and Playlist objects as values.
 */
export type PlaylistData = {
    [key: string]: Playlist;
};

/**
 * Loads the playlists from external storage and returns a Playlist Database.
 * @returns PlaylistData - The loaded Playlist Database.
 */
export const playlists: PlaylistData = loadPlaylists();

/**
 * Loads the songs from external storage and returns a Song Database.
 * @returns SongDatabase - The loaded Song Database.
 */
export const songData: SongDatabase = loadSongs();

/**
 * Represents the song queue, which is a specific playlist named "songQueue" from the Playlist Database.
 */
export const songQueue = playlists["songQueue"];

/**
 * Represents the Readline interface for handling user input.
 */
export const rl: readline.Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
