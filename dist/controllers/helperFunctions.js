"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMatchingSongs = exports.searchSongDatabase = exports.printPlaylists = exports.printSongsIndex = exports.printSongs = exports.createNewPlaylist = exports.isPlaylistNameTaken = exports.isValidPlaylistIndex = exports.isValidSongIndex = void 0;
const dataHandler_1 = require("../dataHandler");
/**
 * Checks if the provided song index is valid.
 * @param songIndex - The index of the song.
 * @param songs - The array of songs in the playlist.
 * @returns Boolean indicating the validity of the song index.
 */
function isValidSongIndex(songIndex, songs) {
    return !isNaN(songIndex) && songIndex > 0 && songIndex <= songs.length;
}
exports.isValidSongIndex = isValidSongIndex;
/**
 * Checks if the playlist index is valid.
 * @param index - The playlist index entered by the user.
 * @param totalPlaylists - The total number of playlists.
 * @returns boolean - True if the index is valid, false otherwise.
 */
function isValidPlaylistIndex(index, totalPlaylists) {
    return !isNaN(index) && index > 0 && index <= totalPlaylists;
}
exports.isValidPlaylistIndex = isValidPlaylistIndex;
/**
 * Checks if a playlist name is already taken.
 * @param name - The name of the playlist to check.
 * @param playlists - The object containing all the playlists.
 * @returns boolean - True if the playlist name is taken, false otherwise.
 */
function isPlaylistNameTaken(name, playlists) {
    return playlists[name] !== undefined;
}
exports.isPlaylistNameTaken = isPlaylistNameTaken;
/**
 * Creates a new playlist with the provided name and adds it to the playlists object.
 * @param playlistName - The name of the new playlist.
 * @param playlists - The object containing all the playlists.
 * @returns void.
 */
function createNewPlaylist(playlistName, playlists) {
    const newPlaylist = {
        name: playlistName,
        songs: [],
        currentSongIndex: -1
    };
    playlists[playlistName] = newPlaylist;
}
exports.createNewPlaylist = createNewPlaylist;
/**
 * Prints the list of songs in a playlist along with their titles and artists.
 * @param songArray - The array of songs in the playlist.
 * @returns Void.
 */
function printSongs(songArray) {
    for (let i = 0; i < songArray.length; i++) {
        console.log(`${songArray[i].title} - ${songArray[i].artist}`);
    }
    console.log();
}
exports.printSongs = printSongs;
/**
 * Prints the list of songs in a playlist along with their titles, artists, and index.
 * @param songArray - The array of songs in the playlist.
 * @returns Void.
 */
function printSongsIndex(songArray) {
    for (let i = 0; i < songArray.length; i++) {
        console.log(`[${i + 1}] ${songArray[i].title} - ${songArray[i].artist}`);
    }
    console.log();
}
exports.printSongsIndex = printSongsIndex;
/**
 * Prints the list of playlists along with their names.
 * @param playlists - The object containing all the playlists.
 * @returns Void.
 */
function printPlaylists(playlists) {
    console.log("Available playlists:");
    Object.values(playlists).forEach((playlist, index) => {
        console.log(`[${index + 1}] ${playlist.name}`);
    });
    console.log();
}
exports.printPlaylists = printPlaylists;
/**
 * Searches the Song Database for songs matching the search criteria.
 * @param songDatabase - The Song Database to search.
 * @param searchTerm - The search term, which may be the title, the artist or a featured artist.
 * @returns Array<Song> - An array of songs matching the search criteria.
 */
function searchSongDatabase(songDatabase, searchTerm) {
    const lowercaseSearchTerm = searchTerm.toLowerCase().trim();
    if (!lowercaseSearchTerm) {
        return [];
    }
    const matchingSongs = [];
    for (const songId in songDatabase.songs) {
        const song = songDatabase.songs[songId];
        const lowercaseTitle = song.title.toLowerCase();
        const lowercaseArtist = song.artist.toLowerCase();
        if (lowercaseTitle.includes(lowercaseSearchTerm, undefined) ||
            lowercaseArtist.includes(lowercaseSearchTerm) ||
            song.collaborators.some(collaborator => collaborator.toLowerCase().includes(lowercaseSearchTerm))) {
            matchingSongs.push(song);
        }
    }
    return matchingSongs;
}
exports.searchSongDatabase = searchSongDatabase;
/**
 * Asks the user to enter a search term and calls the callback function with the matching songs.
 * Continues to prompt the user until at least one matching song is found.
 * @param songDatabase - The Song Database to search.
 * @param callback - The callback function to be called with the matching songs.
 * @returns Void.
 */
function findMatchingSongs(songDatabase, callback) {
    const askQuestion = () => {
        dataHandler_1.rl.question("Search after a song: ", (answer) => {
            const searchTerm = answer.trim();
            const matchingSongs = searchSongDatabase(songDatabase, searchTerm);
            if (matchingSongs.length === 0) {
                console.log("There were no matching songs. Please try again.");
                console.log();
                askQuestion();
            }
            else {
                callback(matchingSongs);
            }
        });
    };
    askQuestion();
}
exports.findMatchingSongs = findMatchingSongs;
