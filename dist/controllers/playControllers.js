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
    const { songs } = selectedPlaylist;
    if (songs.length === 0) {
        console.log("Playlist is empty.");
        console.log();
        return;
    }
    const currentSong = songs[0];
    console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
    console.log();
    selectedPlaylist.currentSongIndex = 0;
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
    const { songs } = selectedPlaylist;
    if (songs.length === 0) {
        console.log("Playlist is empty.");
        console.log();
        (0, menu_1.playlistMenu)(selectedPlaylist);
        return;
    }
    (0, helperFunctions_1.printSongsIndex)(songs);
    types_and_constants_1.rl.question("Enter the number of the song you wish to play: ", (answer) => {
        const songIndex = parseInt(answer);
        if ((0, helperFunctions_1.isValidSongIndex)(songIndex, songs)) {
            const currentSong = songs[songIndex - 1];
            console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
            console.log();
            selectedPlaylist.currentSongIndex = songIndex - 1;
            (0, menu_1.playlistMenu)(selectedPlaylist);
        }
        else {
            console.log("Invalid song number. Please try again.");
            console.log();
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
    const { songs, currentSongIndex } = selectedPlaylist;
    const { songQueue } = playlists;
    if (songQueue.songs.length > 0) {
        console.log("Playing the next song from the song queue:");
        console.log();
        const currentSong = songQueue.songs[0];
        songQueue.songs.shift();
        console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
        console.log();
    }
    else if (songs.length === 0) {
        console.log("Playlist is empty.");
        console.log();
    }
    else {
        const newIndex = currentSongIndex < songs.length - 1 ? currentSongIndex + 1 : 0;
        selectedPlaylist.currentSongIndex = newIndex;
        const currentSong = songs[newIndex];
        console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
        console.log();
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
    const { songs, currentSongIndex } = selectedPlaylist;
    if (songs.length === 0) {
        console.log("Playlist is empty.");
        console.log();
        return;
    }
    if (currentSongIndex === -1) {
        console.log("Play a song in this playlist first.");
        console.log();
        return;
    }
    let newIndex;
    if (currentSongIndex === 0) {
        newIndex = songs.length - 1;
    }
    else {
        newIndex = currentSongIndex - 1;
    }
    const previousSong = songs[newIndex];
    console.log(`Now playing: ${previousSong.title} - ${previousSong.artist}`);
    console.log();
    selectedPlaylist.currentSongIndex = newIndex;
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
    const { songs } = selectedPlaylist;
    if (songs.length === 0) {
        console.log("Playlist is empty.");
        console.log();
        return;
    }
    const randomIndex = Math.floor(Math.random() * songs.length);
    selectedPlaylist.currentSongIndex = randomIndex;
    const currentSong = songs[randomIndex];
    console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
    console.log();
}
exports.shuffleSong = shuffleSong;
function shuffleSongCallback(selectedPlaylist) {
    shuffleSong(selectedPlaylist);
    (0, menu_1.playlistMenu)(selectedPlaylist);
}
exports.shuffleSongCallback = shuffleSongCallback;
