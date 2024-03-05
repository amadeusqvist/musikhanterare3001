import { SongDatabase, PlaylistData, Song, rl, Playlist } from "../dataHandler";
import * as fs from 'fs';
import * as path from 'path';

/**
 * Checks if the provided song index is valid.
 * @param songIndex - The index of the song.
 * @param songs - The array of songs in the playlist.
 * @returns Boolean indicating the validity of the song index.
 */
export function isValidSongIndex(songIndex: number, songs: Array<Song>): boolean {
    return !isNaN(songIndex) && songIndex > 0 && songIndex <= songs.length;
}

/**
 * Checks if the playlist index is valid.
 * @param index - The playlist index entered by the user.
 * @param totalPlaylists - The total number of playlists.
 * @returns boolean - True if the index is valid, false otherwise.
 */
export function isValidPlaylistIndex(index: number, totalPlaylists: number): boolean {
    return !isNaN(index) && index > 0 && index <= totalPlaylists;
}

/**
 * Checks if a playlist name is already taken.
 * @param name - The name of the playlist to check.
 * @param playlists - The object containing all the playlists.
 * @returns boolean - True if the playlist name is taken, false otherwise.
 */
export function isPlaylistNameTaken(name: string, playlists: PlaylistData): boolean {
    return playlists[name] !== undefined;
}

/**
 * Creates a new playlist with the provided name and adds it to the playlists object.
 * @param playlistName - The name of the new playlist.
 * @param playlists - The object containing all the playlists.
 * @returns void.
 */
export function createNewPlaylist(playlistName: string, playlists: PlaylistData): void {
    const newPlaylist: Playlist = {
        name: playlistName,
        songs: [],
        currentSongIndex: -1
    };
    playlists[playlistName] = newPlaylist;
}

/**
 * Prints the list of songs in a playlist along with their titles and artists.
 * @param songArray - The array of songs in the playlist.
 * @returns Void.
 */
export function printSongs(songArray: Array<Song>): void {
    for (let i = 0; i < songArray.length; i++) {
        console.log(`${songArray[i].title} - ${songArray[i].artist}`);
    }
    console.log();
}

/**
 * Prints the list of songs in a playlist along with their titles, artists, and index.
 * @param songArray - The array of songs in the playlist.
 * @returns Void.
 */
export function printSongsIndex(songArray: Array<Song>): void {
    for (let i = 0; i < songArray.length; i++) {
        console.log(`[${i + 1}] ${songArray[i].title} - ${songArray[i].artist}`);
    }
    console.log();
}

/**
 * Prints the list of playlists along with their names.
 * @param playlists - The object containing all the playlists.
 * @returns Void.
 */
export function printPlaylists(playlists: PlaylistData): void {
    console.log("Available playlists:");
    Object.values(playlists).forEach((playlist, index) => {
        console.log(`[${index + 1}] ${playlist.name}`);
    });
    console.log();
}

/**
 * Searches the Song Database for songs matching the search criteria.
 * @param songDatabase - The Song Database to search.
 * @param searchTerm - The search term, which may be the title, the artist or a featured artist.
 * @returns Array<Song> - An array of songs matching the search criteria.
 */
export function searchSongDatabase(songDatabase: SongDatabase, searchTerm: string): Array<Song> {
    const lowercaseSearchTerm = searchTerm.toLowerCase().trim();

    if (!lowercaseSearchTerm) {
        return [];
    }

    const matchingSongs: Array<Song> = [];

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

/**
 * Asks the user to enter a search term and calls the callback function with the matching songs.
 * Continues to prompt the user until at least one matching song is found.
 * @param songDatabase - The Song Database to search.
 * @param callback - The callback function to be called with the matching songs.
 * @returns Void.
 */
export function findMatchingSongs(songDatabase: SongDatabase, callback: (matchingSongs: Array<Song>) => void): void {
    const askQuestion = () => {
        rl.question("Search after a song: ", (answer: string): void => {
            const searchTerm = answer.trim();
            const matchingSongs = searchSongDatabase(songDatabase, searchTerm);

            if (matchingSongs.length === 0) {
                console.log("There were no matching songs. Please try again.");
                console.log();
                askQuestion();
            } else {
                callback(matchingSongs);
            }
        });
    };
    
    askQuestion();
}
