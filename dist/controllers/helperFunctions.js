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
// Assuming helperFunctions.ts is in the controllers directory
const dataFolderPath = path.join(__dirname, '..', '..', 'data');
const playlistsDbPath = path.join(dataFolderPath, 'playlistsdb.json');
const songsDbPath = path.join(dataFolderPath, 'songsdb.json');
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
// Load playlists from JSON file
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
 * @param playlistName - The name of the playlist.
 * @param songs - The array of songs in the playlist.
 * @returns Void.
 */
function printSongs(songArray) {
    for (let i = 0; i < songArray.length; i++) {
        console.log(`${songArray[i].title} - ${songArray[i].artist}`);
    }
}
exports.printSongs = printSongs;
//The same as printSongs but also adds an index to each song.
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
Searches the database for songs.
@param database - The songdatabase.
@param searchTerm - The searchterm may be the title or the artist
@returns An array of songs matching the search criteria.
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
function findMatchingSongs(songDatabase, callback) {
    const askQuestion = () => {
        types_and_constants_1.rl.question("Search after a song: ", (answer) => {
            const searchTerm = answer;
            const matchingSongs = searchSongDatabase(songDatabase, searchTerm);
            if (matchingSongs.length === 0) {
                console.log("There were no matching songs. Please try again.");
                // Recursively call the function to allow the user to try again
                askQuestion();
            }
            else {
                // Callback with matchingSongs array
                callback(matchingSongs);
            }
        });
    };
    askQuestion();
}
exports.findMatchingSongs = findMatchingSongs;
