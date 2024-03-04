"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSong = exports.removeSongHelper = exports.addSong = exports.viewQueue = void 0;
const types_and_constants_1 = require("../types and constants");
const helperFunctions_1 = require("./helperFunctions");
const menu_1 = require("../menu");
/**
 * Displays the queued songs in the song queue and returns to the playlist menu.
 * @param selectedPlaylist - The selected playlist.
 * @param songQueue - The song queue.
 * @returns Void.
 */
function viewQueue(selectedPlaylist, songQueue) {
    if (songQueue.songs.length > 0) {
        (0, helperFunctions_1.printSongsIndex)(songQueue.songs);
    }
    else {
        console.log("There are no queued songs.");
    }
    (0, menu_1.playlistMenu)(selectedPlaylist);
}
exports.viewQueue = viewQueue;
/**
 * Helper function for adding a song to the playlist after the user selects a song from the matching songs.
 * @param selectedPlaylist - The selected playlist.
 * @param matchingSongs - Array of songs matching the search criteria.
 * @param returnPlaylist - The playlist to return to after adding the song.
 * @returns Void.
 */
function addSongHelper(selectedPlaylist, matchingSongs, returnPlaylist) {
    types_and_constants_1.rl.question("Enter the number of the song you wish to add: ", (answer) => {
        const songNumber = parseInt(answer);
        if (!isNaN(songNumber) && songNumber > 0 && songNumber <= matchingSongs.length) {
            const selectedSong = matchingSongs[songNumber - 1];
            selectedPlaylist.songs.push(selectedSong);
            console.log(`Added song: ${selectedSong.title} - ${selectedSong.artist} to ${selectedPlaylist.name}`);
            (0, menu_1.playlistMenu)(returnPlaylist);
        }
        else {
            console.log("Invalid choice.");
            addSongHelper(selectedPlaylist, matchingSongs, returnPlaylist);
        }
    });
}
/**
 * Prompts the user to search for a song, displays matching songs, and allows the user to add a selected song to the playlist.
 * @param selectedPlaylist - The selected playlist.
 * @param songDatabase - The Song Database.
 * @param returnPlaylist - The playlist to return to after adding the song.
 * @returns Void.
 */
function addSong(selectedPlaylist, songDatabase, returnPlaylist) {
    const matchingSongs = [];
    (0, helperFunctions_1.findMatchingSongs)(songDatabase, (selectedSongs) => {
        matchingSongs.push(...selectedSongs);
        console.log("Matching songs:");
        (0, helperFunctions_1.printSongsIndex)(matchingSongs);
        addSongHelper(selectedPlaylist, matchingSongs, returnPlaylist);
    });
}
exports.addSong = addSong;
/**
 * Helper function for removing a song from the playlist after the user selects a song to remove.
 * @param selectedPlaylist - The selected playlist.
 * @returns Void.
 */
function removeSongHelper(selectedPlaylist, songIndex) {
    if (!isNaN(songIndex) && songIndex > 0 && songIndex <= selectedPlaylist.songs.length) {
        selectedPlaylist.songs.splice(songIndex - 1, 1);
        if (selectedPlaylist.currentSongIndex >= songIndex) {
            selectedPlaylist.currentSongIndex = Math.max(selectedPlaylist.currentSongIndex - 1, 0);
        }
        (0, menu_1.playlistMenu)(selectedPlaylist);
    }
    else {
        console.log("Invalid choice.");
        removeSongHelper(selectedPlaylist, songIndex);
    }
}
exports.removeSongHelper = removeSongHelper;
/**
 * Prompts the user to select a song to remove from the playlist and removes the selected song.
 * @param selectedPlaylist - The selected playlist.
 * @returns Void.
 */
function removeSong(selectedPlaylist) {
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
        (0, menu_1.playlistMenu)(selectedPlaylist);
    }
    else {
        console.log(`Songs in playlist ${selectedPlaylist.name}:`);
        (0, helperFunctions_1.printSongsIndex)(selectedPlaylist.songs);
        types_and_constants_1.rl.question("Enter the index of the song you want to remove: ", (answer) => {
            const songIndex = parseInt(answer);
            removeSongHelper(selectedPlaylist, songIndex);
        });
    }
}
exports.removeSong = removeSong;
