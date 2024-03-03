"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSong = exports.removeSongHelper = exports.addSong = exports.viewQueue = void 0;
const types_and_constants_1 = require("../types and constants");
const helperFunctions_1 = require("./helperFunctions");
const menu_1 = require("../menu");
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
function addSong(selectedPlaylist, songDatabase, returnPlaylist) {
    // initiate empty array of matching songs
    const matchingSongs = [];
    // add all matching songs into the matchingSongs array
    (0, helperFunctions_1.findMatchingSongs)(songDatabase, (selectedSongs) => {
        matchingSongs.push(...selectedSongs);
        console.log("Matching songs:");
        (0, helperFunctions_1.printSongsIndex)(matchingSongs);
        addSongHelper(selectedPlaylist, matchingSongs, returnPlaylist);
    });
}
exports.addSong = addSong;
function removeSongHelper(selectedPlaylist) {
    types_and_constants_1.rl.question("Enter the index of the song you want to remove: ", (answer) => {
        const songIndex = parseInt(answer);
        if (!isNaN(songIndex) && songIndex > 0 && songIndex <= selectedPlaylist.songs.length) {
            selectedPlaylist.songs.splice(songIndex - 1, 1); // Adjust index by 1 and remove 1 element
            if (selectedPlaylist.currentSongIndex >= songIndex) {
                selectedPlaylist.currentSongIndex = Math.max(selectedPlaylist.currentSongIndex - 1, 0);
            }
            (0, menu_1.playlistMenu)(selectedPlaylist);
        }
        else {
            console.log("Invalid choice.");
            removeSongHelper(selectedPlaylist);
        }
    });
}
exports.removeSongHelper = removeSongHelper;
function removeSong(selectedPlaylist) {
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
        (0, menu_1.playlistMenu)(selectedPlaylist);
    }
    else {
        console.log(`Songs in playlist ${selectedPlaylist.name}:`);
        (0, helperFunctions_1.printSongsIndex)(selectedPlaylist.songs);
        removeSongHelper(selectedPlaylist);
    }
}
exports.removeSong = removeSong;
