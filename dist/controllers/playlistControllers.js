"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSongHelper = exports.removeSong = exports.addSongHelper = exports.addSong = exports.viewQueueCallback = exports.viewQueue = void 0;
const dataHandler_1 = require("../dataHandler");
const helperFunctions_1 = require("./helperFunctions");
const menu_1 = require("../menu");
/**
 * Displays the queued songs in the song queue and returns to the playlist menu.
 * @param selectedPlaylist - The selected playlist.
 * @param songQueue - The song queue.
 * @returns Void.
 */
function viewQueue(selectedPlaylist, songQueue) {
    const { songs } = songQueue;
    if (songs.length > 0) {
        (0, helperFunctions_1.printSongsIndex)(songs);
    }
    else {
        console.log("There are no queued songs.");
        console.log();
    }
}
exports.viewQueue = viewQueue;
function viewQueueCallback(selectedPlaylist, songQueue) {
    viewQueue(selectedPlaylist, songQueue);
    (0, menu_1.playlistMenu)(selectedPlaylist);
}
exports.viewQueueCallback = viewQueueCallback;
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
        if (matchingSongs.length === 0) {
            (0, menu_1.playlistMenu)(returnPlaylist);
        }
        console.log("Matching songs:");
        console.log();
        (0, helperFunctions_1.printSongsIndex)(matchingSongs);
        dataHandler_1.rl.question("Enter the number of the song you wish to add: ", (answer) => {
            const songIndex = parseInt(answer);
            if ((0, helperFunctions_1.isValidSongIndex)(songIndex, matchingSongs)) {
                addSongCallback(selectedPlaylist, matchingSongs, returnPlaylist, songIndex);
            }
            else {
                console.log("Invalid song index. Please try again.");
                console.log();
                addSong(selectedPlaylist, songDatabase, returnPlaylist);
            }
        });
    });
}
exports.addSong = addSong;
function addSongCallback(selectedPlaylist, matchingSongs, returnPlaylist, songIndex) {
    addSongHelper(selectedPlaylist, matchingSongs, songIndex);
    (0, menu_1.playlistMenu)(returnPlaylist);
}
/**
 * Helper function for adding a song to the playlist after the user selects a song from the matching songs.
 * @param selectedPlaylist - The selected playlist.
 * @param matchingSongs - Array of songs matching the search criteria.
 * @param returnPlaylist - The playlist to return to after adding the song.
 * @returns Void.
 */
function addSongHelper(selectedPlaylist, matchingSongs, songNumber) {
    const selectedSong = matchingSongs[songNumber - 1];
    selectedPlaylist.songs.push(selectedSong);
    console.log(`Added song: ${selectedSong.title} - ${selectedSong.artist} to ${selectedPlaylist.name}`);
    console.log();
}
exports.addSongHelper = addSongHelper;
/**
 * Prompts the user to select a song to remove from the playlist and removes the selected song.
 * @param selectedPlaylist - The selected playlist.
 * @returns Void.
 */
function removeSong(selectedPlaylist) {
    const { songs, name } = selectedPlaylist;
    if (songs.length === 0) {
        console.log(`Playlist ${name} is empty.`);
        console.log();
        (0, menu_1.playlistMenu)(selectedPlaylist);
        return;
    }
    console.log(`Songs in playlist ${name}:`);
    console.log();
    (0, helperFunctions_1.printSongsIndex)(songs);
    dataHandler_1.rl.question("Enter the index of the song you want to remove: ", (answer) => {
        const songIndex = parseInt(answer);
        if ((0, helperFunctions_1.isValidSongIndex)(songIndex, songs)) {
            removeSongHelperCallback(selectedPlaylist, songIndex);
        }
        else {
            console.log("Invalid song index. Please try again.");
            console.log();
            removeSong(selectedPlaylist);
        }
    });
}
exports.removeSong = removeSong;
function removeSongHelperCallback(selectedPlaylist, songIndex) {
    removeSongHelper(selectedPlaylist, songIndex);
    (0, menu_1.playlistMenu)(selectedPlaylist);
}
/**
 * Helper function for removing a song from the playlist after the user selects a song to remove.
 * @param selectedPlaylist - The selected playlist.
 * @param songIndex - The index of the song to be removed.
 * @returns Void.
 */
function removeSongHelper(selectedPlaylist, songIndex) {
    const { songs, currentSongIndex } = selectedPlaylist;
    songs.splice(songIndex - 1, 1);
    if (currentSongIndex >= songIndex) {
        selectedPlaylist.currentSongIndex = Math.max(currentSongIndex - 1, 0);
    }
}
exports.removeSongHelper = removeSongHelper;
