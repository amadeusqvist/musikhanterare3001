"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePlaylistMenu = exports.playlistMenu = exports.choosePlaylistMenu = exports.mainMenu = void 0;
const types_and_constants_1 = require("./types and constants");
const helperFunctions_1 = require("./controllers/helperFunctions");
const playControllers_1 = require("./controllers/playControllers");
const playlistControllers_1 = require("./controllers/playlistControllers");
const spotify_api_1 = require("./spotify-api");
/**
 * Displays the main menu and prompts the user to choose an action.
 * Options include choosing a playlist, making a new playlist, or importing a Spotify playlist.
 * @returns Void.
 */
function mainMenu() {
    console.log("[1] Choose Playlist");
    console.log("[2] Make Playlist");
    console.log("[3] Import Spotify playlist");
    types_and_constants_1.rl.question("Enter your choice: ", (answer) => {
        if (answer === '1') {
            choosePlaylistMenu(types_and_constants_1.playlists);
        }
        else if (answer === '2') {
            makePlaylistMenu(types_and_constants_1.playlists);
        }
        else if (answer === '3') {
            (0, spotify_api_1.importPlaylist)();
        }
        else {
            console.log("Invalid choice. Please enter 1 or 2.");
            mainMenu();
        }
    });
}
exports.mainMenu = mainMenu;
/**
 * Displays the menu for choosing a playlist and prompts the user to select a playlist.
 * Prints the list of playlists and allows the user to choose a playlist by index.
 * @param playlists - The object containing all the playlists.
 * @returns Void.
 */
function choosePlaylistMenu(playlists) {
    (0, helperFunctions_1.printPlaylists)(playlists);
    types_and_constants_1.rl.question("Enter the index of the playlist you want to choose: ", (answer) => {
        const index = parseInt(answer);
        if (!isNaN(index) && index > 0 && index <= Object.keys(playlists).length) {
            const playlistNames = Object.keys(playlists);
            const selectedPlaylistKey = playlistNames[index - 1];
            const selectedPlaylist = playlists[selectedPlaylistKey];
            console.log(`Songs in playlist "${selectedPlaylist.name}":`);
            (0, helperFunctions_1.printSongs)(selectedPlaylist.songs);
            playlistMenu(selectedPlaylist);
        }
        else {
            console.log("Invalid playlist index. Please try again.");
            choosePlaylistMenu(playlists);
        }
    });
}
exports.choosePlaylistMenu = choosePlaylistMenu;
/**
 * Displays the menu for the selected playlist and prompts the user to choose an action.
 * Options include playing the playlist, playing a specific song, managing the playlist, and more.
 * @param selectedPlaylist - The playlist selected by the user.
 * @returns Void.
 */
function playlistMenu(selectedPlaylist) {
    console.log(`Selected playlist: ${selectedPlaylist.name}`);
    console.log("[1] Play playlist");
    console.log("[2] Play specific song");
    console.log("[3] Play next song");
    console.log("[4] Play previous song");
    console.log("[5] Add song to playlist");
    console.log("[6] Remove song from playlist");
    console.log("[7] Queue song");
    console.log("[8] View queued songs");
    console.log("[9] Shuffle");
    console.log("[10] Change playlist");
    types_and_constants_1.rl.question("Enter your choice: ", (answer) => {
        if (answer === '1') {
            (0, playControllers_1.playPlaylistCallback)(selectedPlaylist);
        }
        else if (answer === '2') {
            (0, playControllers_1.playSpecificSong)(selectedPlaylist);
        }
        else if (answer === '3') {
            (0, playControllers_1.playNextSongCallback)(selectedPlaylist, types_and_constants_1.playlists);
        }
        else if (answer === '4') {
            (0, playControllers_1.playPreviousSongCallback)(selectedPlaylist);
        }
        else if (answer === '5') {
            (0, playlistControllers_1.addSong)(selectedPlaylist, types_and_constants_1.songData, selectedPlaylist);
        }
        else if (answer === '6') {
            (0, playlistControllers_1.removeSong)(selectedPlaylist);
        }
        else if (answer === '7') {
            (0, playlistControllers_1.addSong)(types_and_constants_1.songQueue, types_and_constants_1.songData, selectedPlaylist);
        }
        else if (answer === '8') {
            (0, playlistControllers_1.viewQueue)(selectedPlaylist, types_and_constants_1.songQueue);
        }
        else if (answer === '9') {
            (0, playControllers_1.shuffleSongCallback)(selectedPlaylist);
        }
        else if (answer === '10') {
            mainMenu();
        }
        else {
            console.log("Invalid choice. Please enter valid number (1-10).");
            playlistMenu(selectedPlaylist);
        }
    });
}
exports.playlistMenu = playlistMenu;
/**
 * Displays the menu for creating a new playlist and prompts the user to enter a name.
 * Checks if the entered name already exists and handles accordingly.
 * @param playlists - The object containing all the playlists.
 * @returns Void.
 */
function makePlaylistMenu(playlists) {
    types_and_constants_1.rl.question("Give the new playlist a name: ", (playlistName) => {
        if (playlists[playlistName]) {
            console.log("Playlistname already exists");
            makePlaylistMenu(playlists);
        }
        else {
            const newPlaylist = {
                name: playlistName,
                songs: [],
                currentSongIndex: -1
            };
            playlists[playlistName] = newPlaylist;
            playlistMenu(playlists[playlistName]);
        }
    });
}
exports.makePlaylistMenu = makePlaylistMenu;
