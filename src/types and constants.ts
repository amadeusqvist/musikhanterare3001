import * as readline from 'readline';
import * as path from 'path';
import * as fs from 'fs';



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

// Define paths to the playlistdb.json and songsdb.json
const dataFolderPath = path.join(__dirname, '..', 'data');
const playlistsDbPath = path.join(dataFolderPath, 'playlistsdb.json');
const songsDbPath = path.join(dataFolderPath, 'songsdb.json');

/**
 * Loads songs from the JSON file specified in the songsDbPath and returns a Song Database.
 * @returns SongDatabase - The loaded Song Database.
 */
export function loadSongs(): SongDatabase {
    try {
        const data = fs.readFileSync(songsDbPath, 'utf8');
        return JSON.parse(data) as SongDatabase;
    } catch (error) {
        console.error('Error loading songs:', error);
        return { songs: [] };
    }
}

/**
 * Loads playlists from the JSON file specified in the playlistsDbPath and returns a Playlist Database.
 * @returns PlaylistData - The loaded Playlist Database.
 */
export function loadPlaylists(): PlaylistData {
	try {
		const data = fs.readFileSync(playlistsDbPath, 'utf8');
		return JSON.parse(data) as PlaylistData;
	} catch (error) {
		console.error('Error loading playlists:', error);
		return {};
	}
}

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
