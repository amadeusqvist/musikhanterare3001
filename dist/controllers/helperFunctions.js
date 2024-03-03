"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMatchingSongs = exports.searchSongDatabase = exports.printPlaylists = exports.printSongsIndex = exports.printSongs = exports.loadPlaylists = exports.loadSongs = void 0;
const types_and_constants_1 = require("../types and constants");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Define paths to the playlistdb.json and songsdb.json
const dataFolderPath = path.join(__dirname, '..', '..', 'data');
const playlistsDbPath = path.join(dataFolderPath, 'playlistsdb.json');
const songsDbPath = path.join(dataFolderPath, 'songsdb.json');
/**
 * Loads songs from the JSON file specified in the songsDbPath and returns a Song Database.
 * @returns SongDatabase - The loaded Song Database.
 */
function loadSongs() {
    try {
        const data = fs.readFileSync(songsDbPath, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Error loading songs:', error);
        return { songs: [] };
    }
}
exports.loadSongs = loadSongs;
/**
 * Loads playlists from the JSON file specified in the playlistsDbPath and returns a Playlist Database.
 * @returns PlaylistData - The loaded Playlist Database.
 */
function loadPlaylists() {
    try {
        const data = fs.readFileSync(playlistsDbPath, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Error loading playlists:', error);
        return {};
    }
}
exports.loadPlaylists = loadPlaylists;
/**
 * Prints the list of songs in a playlist along with their titles and artists.
 * @param songArray - The array of songs in the playlist.
 * @returns Void.
 */
function printSongs(songArray) {
    for (let i = 0; i < songArray.length; i++) {
        console.log(`${songArray[i].title} - ${songArray[i].artist}`);
    }
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
}
exports.printPlaylists = printPlaylists;
/**
 * Searches the Song Database for songs matching the search criteria.
 * @param songDatabase - The Song Database to search.
 * @param searchTerm - The search term, which may be the title, the artist or a featured artist.
 * @returns Array<Song> - An array of songs matching the search criteria.
 */
function searchSongDatabase(songDatabase, searchTerm) {
    const matchingSongs = [];
    const lowercaseSearchTerm = searchTerm.toLowerCase();
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
        types_and_constants_1.rl.question("Search after a song: ", (answer) => {
            const searchTerm = answer;
            const matchingSongs = searchSongDatabase(songDatabase, searchTerm);
            if (matchingSongs.length === 0) {
                console.log("There were no matching songs. Please try again.");
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
