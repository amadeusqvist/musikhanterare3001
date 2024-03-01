"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMatchingSongs = exports.searchSongDatabase = exports.printPlaylists = exports.printSongsIndex = exports.printSongs = exports.loadPlaylists = exports.loadSongs = void 0;
var types_and_constants_1 = require("../types and constants");
var fs = require("fs");
function loadSongs() {
    try {
        var data = fs.readFileSync('songsdb.json', 'utf8');
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
        var data = fs.readFileSync('playlistsdb.json', 'utf8');
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
    for (var i = 0; i < songArray.length; i++) {
        console.log("".concat(songArray[i].title, " - ").concat(songArray[i].artist));
    }
}
exports.printSongs = printSongs;
//The same as printSongs but also adds an index to each song.
function printSongsIndex(songArray) {
    for (var i = 0; i < songArray.length; i++) {
        console.log("[".concat(i + 1, "] ").concat(songArray[i].title, " - ").concat(songArray[i].artist));
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
    Object.values(playlists).forEach(function (playlist, index) {
        console.log("[".concat(index + 1, "] ").concat(playlist.name));
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
    var matchingSongs = [];
    var lowercaseSearchTerm = searchTerm.toLowerCase();
    for (var songId in songDatabase.songs) {
        var song = songDatabase.songs[songId];
        var lowercaseTitle = song.title.toLowerCase();
        var lowercaseArtist = song.artist.toLowerCase();
        if (lowercaseTitle.includes(lowercaseSearchTerm, undefined) ||
            lowercaseArtist.includes(lowercaseSearchTerm) ||
            song.collaborators.some(function (collaborator) {
                return collaborator.toLowerCase().includes(lowercaseSearchTerm);
            })) {
            matchingSongs.push(song);
        }
    }
    return matchingSongs;
}
exports.searchSongDatabase = searchSongDatabase;
function findMatchingSongs(songDatabase, callback) {
    var askQuestion = function () {
        types_and_constants_1.rl.question("Search after a song: ", function (answer) {
            var searchTerm = answer;
            var matchingSongs = searchSongDatabase(songDatabase, searchTerm);
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
