import { loadPlaylists, loadSongs } from "./controllers/helperFunctions";
import * as readline from 'readline';

export type Song = {
	title: string;
	artist: string;
	album: string;
	collaborators: Array<string>; 
};

export type SongDatabase = {
    songs: Array<Song>;
};

export type Playlist = {
	name: string;
	songs: Array<Song>;
    currentSongIndex: number
};

export type PlaylistData = {
	[key: string]: Playlist;
};

export const playlists: PlaylistData = loadPlaylists();

export const songData: SongDatabase = loadSongs();

export const songQueue = playlists["songQueue"];

export const rl: readline.Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});