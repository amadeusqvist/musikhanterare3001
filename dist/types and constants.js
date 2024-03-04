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
exports.rl = exports.songQueue = exports.songData = exports.playlists = exports.loadPlaylists = exports.loadSongs = void 0;
const readline = __importStar(require("readline"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// Define paths to the playlistdb.json and songsdb.json
const dataFolderPath = path.join(__dirname, '..', 'data');
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
 * Loads the playlists from external storage and returns a Playlist Database.
 * @returns PlaylistData - The loaded Playlist Database.
 */
exports.playlists = loadPlaylists();
/**
 * Loads the songs from external storage and returns a Song Database.
 * @returns SongDatabase - The loaded Song Database.
 */
exports.songData = loadSongs();
/**
 * Represents the song queue, which is a specific playlist named "songQueue" from the Playlist Database.
 */
exports.songQueue = exports.playlists["songQueue"];
/**
 * Represents the Readline interface for handling user input.
 */
exports.rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
