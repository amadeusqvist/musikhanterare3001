"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSong = exports.removeSongHelper = exports.addSong = exports.viewQueue = void 0;
var types_and_constants_1 = require("../types and constants");
var helperFunctions_1 = require("./helperFunctions");
var menu_1 = require("../menu");
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
    types_and_constants_1.rl.question("Enter the number of the song you wish to add: ", function (answer) {
        var songNumber = parseInt(answer);
        if (!isNaN(songNumber) && songNumber > 0 && songNumber <= matchingSongs.length) {
            var selectedSong = matchingSongs[songNumber - 1];
            selectedPlaylist.songs.push(selectedSong);
            console.log("Added song: ".concat(selectedSong.title, " - ").concat(selectedSong.artist, " to ").concat(selectedPlaylist.name));
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
    var matchingSongs = [];
    // add all matching songs into the matchingSongs array
    (0, helperFunctions_1.findMatchingSongs)(songDatabase, function (selectedSongs) {
        matchingSongs.push.apply(matchingSongs, selectedSongs);
        console.log("Matching songs:");
        (0, helperFunctions_1.printSongsIndex)(matchingSongs);
        addSongHelper(selectedPlaylist, matchingSongs, returnPlaylist);
    });
}
exports.addSong = addSong;
function removeSongHelper(selectedPlaylist) {
    types_and_constants_1.rl.question("Enter the index of the song you want to remove: ", function (answer) {
        var songIndex = parseInt(answer);
        if (!isNaN(songIndex) && songIndex > 0 && songIndex <= Object.keys(selectedPlaylist).length) {
            selectedPlaylist.songs = selectedPlaylist.songs.slice(0, songIndex), selectedPlaylist.songs.slice(songIndex + 1);
            if (selectedPlaylist.currentSongIndex < songIndex) {
                selectedPlaylist.currentSongIndex = selectedPlaylist.currentSongIndex - 1;
            }
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
    }
    else {
        console.log("Songs in playlist \"".concat(selectedPlaylist.name, "\":"));
        (0, helperFunctions_1.printSongs)(selectedPlaylist.songs);
        removeSongHelper(selectedPlaylist);
    }
}
exports.removeSong = removeSong;
