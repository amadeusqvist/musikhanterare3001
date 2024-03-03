import { SongDatabase, PlaylistData, Song, rl } from "../types and constants";
import * as fs from 'fs';
import * as path from 'path';

// Assuming helperFunctions.ts is in the controllers directory
const dataFolderPath = path.join(__dirname, '..', '..', 'data');
const playlistsDbPath = path.join(dataFolderPath, 'playlistsdb.json');
const songsDbPath = path.join(dataFolderPath, 'songsdb.json');

export function loadSongs(): SongDatabase {
    try {
        const data = fs.readFileSync(songsDbPath, 'utf8');
        return JSON.parse(data) as SongDatabase;
    } catch (error) {
        console.error('Error loading songs:', error);
        return { songs: [] };
    }
}

// Load playlists from JSON file
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
 * Prints the list of songs in a playlist along with their titles and artists.
 * @param playlistName - The name of the playlist.
 * @param songs - The array of songs in the playlist.
 * @returns Void.
 */
export function printSongs(songArray: Song[]): void {
    for (let i = 0; i < songArray.length; i++) {
        console.log(`${songArray[i].title} - ${songArray[i].artist}`);
    }
}

//The same as printSongs but also adds an index to each song.
export function printSongsIndex(songArray: Song[]): void {
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
Searches the database for songs.
@param database - The songdatabase.
@param searchTerm - The searchterm may be the title or the artist
@returns An array of songs matching the search criteria.
*/
export function searchSongDatabase(songDatabase: SongDatabase, searchTerm: string): Array<Song> {
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

export function findMatchingSongs(songDatabase: SongDatabase, callback: (matchingSongs: Song[]) => void): void {
    const askQuestion = () => {
        rl.question("Search after a song: ", (answer: string): void => {
            const searchTerm = answer;
            const matchingSongs = searchSongDatabase(songDatabase, searchTerm);

            if (matchingSongs.length === 0) {
                console.log("There were no matching songs. Please try again.");
                // Recursively call the function to allow the user to try again
                askQuestion();
            } else {
                // Callback with matchingSongs array
                callback(matchingSongs);
            }
        });
    };
    askQuestion();
}
