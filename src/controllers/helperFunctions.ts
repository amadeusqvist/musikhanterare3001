import { SongDatabase, PlaylistData, Song, rl } from "../types and constants";
import * as fs from 'fs';
import * as path from 'path';

/**
 * Prints the list of songs in a playlist along with their titles and artists.
 * @param songArray - The array of songs in the playlist.
 * @returns Void.
 */
export function printSongs(songArray: Array<Song>): void {
    for (let i = 0; i < songArray.length; i++) {
        console.log(`${songArray[i].title} - ${songArray[i].artist}`);
    }
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
}

/**
 * Searches the Song Database for songs matching the search criteria.
 * @param songDatabase - The Song Database to search.
 * @param searchTerm - The search term, which may be the title, the artist or a featured artist.
 * @returns Array<Song> - An array of songs matching the search criteria.
 */
export function searchSongDatabase(songDatabase: SongDatabase, searchTerm: string): Array<Song> {
    const matchingSongs: Array<Song> = [];
    const lowercaseSearchTerm = searchTerm.toLowerCase();

    if (lowercaseSearchTerm === "") {
        return matchingSongs;
    }

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
            const searchTerm = answer;
            const matchingSongs = searchSongDatabase(songDatabase, searchTerm);

            if (matchingSongs.length === 0) {
                console.log("There were no matching songs. Please try again.");
                askQuestion();
            } else {
                callback(matchingSongs);
            }
        });
    };
    askQuestion();
}
