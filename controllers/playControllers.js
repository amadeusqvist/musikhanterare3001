"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleSong = exports.playPreviousSong = exports.playNextSong = exports.playSpecificSong = exports.playPlaylist = void 0;
var types_and_constants_1 = require("../types and constants");
var menu_1 = require("../menu");
var helperFunctions_1 = require("./helperFunctions");
/**
 * Plays the first song in the playlist and prompts the user to navigate to the next song or return to the playlist menu.
 * @param selectedPlaylist - The name of the selected playlist.
 * @param songs - The array of songs in the playlist.
 * @returns Void.
 */
function playPlaylist(selectedPlaylist) {
    console.log("Now playing playlist: ".concat(selectedPlaylist.name));
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
    }
    else {
        var currentSong = selectedPlaylist.songs[0];
        console.log("Now playing: ".concat(currentSong.title, " - ").concat(currentSong.artist));
        selectedPlaylist.currentSongIndex = 0;
    }
    (0, menu_1.playlistMenu)(selectedPlaylist);
}
exports.playPlaylist = playPlaylist;
/**
 * Plays the specific song chosen by the user from the playlist and prompts the user to navigate to the next song or return to the playlist menu.
 * @param selectedPlaylistName - The name of the selected playlist.
 * @param songs - The array of songs in the playlist.
 * @returns Void.
 */
function playSpecificSong(selectedPlaylist) {
    console.log("Playlist: ".concat(selectedPlaylist.name));
    (0, helperFunctions_1.printSongsIndex)(selectedPlaylist.songs);
    types_and_constants_1.rl.question("Enter the number of the song you wish to play: ", function (answer) {
        var songIndex = parseInt(answer);
        if (!isNaN(songIndex) && songIndex > 0 && songIndex <= selectedPlaylist.songs.length) {
            var currentSong = selectedPlaylist.songs[songIndex - 1];
            console.log("Now playing: ".concat(currentSong.title, " - ").concat(currentSong.artist));
            selectedPlaylist.currentSongIndex = songIndex - 1;
            (0, menu_1.playlistMenu)(selectedPlaylist);
        }
        else {
            console.log("Invalid song number. Please try again.");
            playSpecificSong(selectedPlaylist); // Prompt again if input is invalid
        }
    });
}
exports.playSpecificSong = playSpecificSong;
function playNextSong(selectedPlaylist, playlists) {
    if (types_and_constants_1.songQueue.songs.length > 0) {
        console.log("Playing the next song from the song queue:");
        var currentSong = types_and_constants_1.songQueue.songs[0];
        console.log("Now playing: ".concat(currentSong.title, " - ").concat(currentSong.artist));
        types_and_constants_1.songQueue.songs.shift(); // Remove the played song from the queue
    }
    else {
        if (selectedPlaylist.currentSongIndex < selectedPlaylist.songs.length - 1) {
            selectedPlaylist.currentSongIndex++;
            var currentSong = selectedPlaylist.songs[selectedPlaylist.currentSongIndex];
            console.log("Now playing: ".concat(currentSong.title, " - ").concat(currentSong.artist));
        }
        else {
            selectedPlaylist.currentSongIndex = 0;
            var currentSong = selectedPlaylist.songs[0];
            console.log("Now playing: ".concat(currentSong.title, " - ").concat(currentSong.artist));
        }
    }
    (0, menu_1.playlistMenu)(selectedPlaylist);
}
exports.playNextSong = playNextSong;
/**
 * Plays the previous song in the playlist.
 * @param selectedPlaylist - The selected playlist.
 * @returns Void.
 */
function playPreviousSong(selectedPlaylist) {
    if (selectedPlaylist.currentSongIndex === -1) {
        console.log("No song currently playing.");
    }
    else if (selectedPlaylist.currentSongIndex === 0) {
        var currentIndex = selectedPlaylist.songs.length - 1;
        var currentSong = selectedPlaylist.songs[currentIndex];
        console.log("Now playing ".concat(currentSong.title, " - ").concat(currentSong.artist));
        selectedPlaylist.currentSongIndex = currentIndex;
    }
    else {
        var currentIndex = selectedPlaylist.currentSongIndex - 1;
        var previousSong = selectedPlaylist.songs[currentIndex];
        console.log("Now playing: ".concat(previousSong.title, " - ").concat(previousSong.artist));
        selectedPlaylist.currentSongIndex = currentIndex;
    }
    (0, menu_1.playlistMenu)(selectedPlaylist);
}
exports.playPreviousSong = playPreviousSong;
function shuffleSong(selectedPlaylist) {
    console.log("Now playing playlist: ".concat(selectedPlaylist));
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
    }
    else {
        var songs = selectedPlaylist.songs;
        var random_index = Math.floor(Math.random() * songs.length);
        var currentSong = selectedPlaylist.songs[random_index];
        console.log("Now playing: ".concat(currentSong.title, " - ").concat(currentSong.artist));
    }
    (0, menu_1.playlistMenu)(selectedPlaylist);
}
exports.shuffleSong = shuffleSong;
