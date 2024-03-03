"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleSong = exports.playPreviousSong = exports.playNextSong = exports.playSpecificSong = exports.playPlaylist = void 0;
const types_and_constants_1 = require("../types and constants");
const menu_1 = require("../menu");
const helperFunctions_1 = require("./helperFunctions");
/**
 * Plays the first song in the playlist and prompts the user to navigate to the next song or return to the playlist menu.
 * @param selectedPlaylist - The name of the selected playlist.
 * @param songs - The array of songs in the playlist.
 * @returns Void.
 */
function playPlaylist(selectedPlaylist) {
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
    }
    else {
        const currentSong = selectedPlaylist.songs[0];
        console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
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
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
        (0, menu_1.playlistMenu)(selectedPlaylist);
    }
    (0, helperFunctions_1.printSongsIndex)(selectedPlaylist.songs);
    types_and_constants_1.rl.question("Enter the number of the song you wish to play: ", (answer) => {
        const songIndex = parseInt(answer);
        if (!isNaN(songIndex) && songIndex > 0 && songIndex <= selectedPlaylist.songs.length) {
            const currentSong = selectedPlaylist.songs[songIndex - 1];
            console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
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
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
        (0, menu_1.playlistMenu)(selectedPlaylist);
    }
    else if (types_and_constants_1.songQueue.songs.length > 0) {
        console.log("Playing the next song from the song queue:");
        const currentSong = types_and_constants_1.songQueue.songs[0];
        console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
        types_and_constants_1.songQueue.songs.shift(); // Remove the played song from the queue
    }
    else {
        if (selectedPlaylist.currentSongIndex < selectedPlaylist.songs.length - 1) {
            selectedPlaylist.currentSongIndex++;
            const currentSong = selectedPlaylist.songs[selectedPlaylist.currentSongIndex];
            console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
        }
        else {
            selectedPlaylist.currentSongIndex = 0;
            const currentSong = selectedPlaylist.songs[0];
            console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
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
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty");
    }
    else if (selectedPlaylist.currentSongIndex === -1) {
        console.log("No song currently playing.");
    }
    else if (selectedPlaylist.currentSongIndex === 0) {
        const currentIndex = selectedPlaylist.songs.length - 1;
        const currentSong = selectedPlaylist.songs[currentIndex];
        console.log(`Now playing ${currentSong.title} - ${currentSong.artist}`);
        selectedPlaylist.currentSongIndex = currentIndex;
    }
    else {
        const currentIndex = selectedPlaylist.currentSongIndex - 1;
        const previousSong = selectedPlaylist.songs[currentIndex];
        console.log(`Now playing: ${previousSong.title} - ${previousSong.artist}`);
        selectedPlaylist.currentSongIndex = currentIndex;
    }
    (0, menu_1.playlistMenu)(selectedPlaylist);
}
exports.playPreviousSong = playPreviousSong;
function shuffleSong(selectedPlaylist) {
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
    }
    else {
        const songs = selectedPlaylist.songs;
        const random_index = Math.floor(Math.random() * songs.length);
        const currentSong = selectedPlaylist.songs[random_index];
        console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
    }
    (0, menu_1.playlistMenu)(selectedPlaylist);
}
exports.shuffleSong = shuffleSong;
