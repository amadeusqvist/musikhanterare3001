"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleSongCallback = exports.shuffleSong = exports.playPreviousSongCallback = exports.playPreviousSong = exports.playNextSongCallback = exports.playNextSong = exports.playSpecificSong = exports.playPlaylistCallback = exports.playPlaylist = void 0;
const types_and_constants_1 = require("../types and constants");
const menu_1 = require("../menu");
const helperFunctions_1 = require("./helperFunctions");
/**
 * Plays the first song in the playlist and prompts the user to navigate to the next song or return to the playlist menu.
 * @param selectedPlaylist - The selected playlist.
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
}
exports.playPlaylist = playPlaylist;
function playPlaylistCallback(selectedPlaylist) {
    playPlaylist(selectedPlaylist);
    (0, menu_1.playlistMenu)(selectedPlaylist);
}
exports.playPlaylistCallback = playPlaylistCallback;
/**
 * Plays the specific song chosen by the user from the playlist and prompts the user to navigate to the next song or return to the playlist menu.
 * @param selectedPlaylist - The selected playlist.
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
            playSpecificSong(selectedPlaylist);
        }
    });
}
exports.playSpecificSong = playSpecificSong;
/**
 * Plays the next song in the playlist or from the song queue and prompts the user to navigate to the next song or return to the playlist menu.
 * @param selectedPlaylist - The selected playlist.
 * @param playlists - The Playlist Database.
 * @returns Void.
 */
function playNextSong(selectedPlaylist, playlists) {
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
    }
    else if (playlists.songQueue.songs.length > 0) {
        console.log("Playing the next song from the song queue:");
        const currentSong = playlists.songQueue.songs[0];
        console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
        playlists.songQueue.songs.shift();
    }
    else {
        if (selectedPlaylist.currentSongIndex < selectedPlaylist.songs.length - 1) {
            const currentSongIndex = selectedPlaylist.currentSongIndex;
            selectedPlaylist.currentSongIndex = currentSongIndex + 1;
            const currentSong = selectedPlaylist.songs[selectedPlaylist.currentSongIndex];
            console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
        }
        else {
            selectedPlaylist.currentSongIndex = 0;
            const currentSong = selectedPlaylist.songs[0];
            console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
        }
    }
}
exports.playNextSong = playNextSong;
function playNextSongCallback(selectedPlaylist, playlists) {
    playNextSong(selectedPlaylist, playlists);
    (0, menu_1.playlistMenu)(selectedPlaylist);
}
exports.playNextSongCallback = playNextSongCallback;
/**
 * Plays the previous song in the playlist and prompts the user to navigate to the next song or return to the playlist menu.
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
}
exports.playPreviousSong = playPreviousSong;
function playPreviousSongCallback(selectedPlaylist) {
    playPreviousSong(selectedPlaylist);
    (0, menu_1.playlistMenu)(selectedPlaylist);
}
exports.playPreviousSongCallback = playPreviousSongCallback;
/**
 * Plays a randomly selected song in the selected playlist.
 * @param selectedPlaylist - The selected playlist.
 * @returns Void.
 */
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
}
exports.shuffleSong = shuffleSong;
function shuffleSongCallback(selectedPlaylist) {
    shuffleSong(selectedPlaylist);
    (0, menu_1.playlistMenu)(selectedPlaylist);
}
exports.shuffleSongCallback = shuffleSongCallback;
