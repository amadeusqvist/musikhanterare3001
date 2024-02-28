"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var fs = require("fs");
// Load playlists from JSON file
function loadPlaylists() {
    try {
        var data = fs.readFileSync('playlists.json', 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Error loading playlists:', error);
        return {};
    }
}
var playlists = loadPlaylists();
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function mainMenu() {
    console.log("[1] Choose Playlist");
    console.log("[2] Make Playlist");
    rl.question("Enter your choice: ", function (answer) {
        if (answer === '1') {
            choosePlaylistMenu(playlists);
        }
        else if (answer === '2') {
            makePlaylistMenu();
        }
        else {
            console.log("Invalid choice. Please enter 1 or 2.");
            mainMenu();
        }
    });
}
/**
 * Displays the menu for choosing a playlist and prompts the user to select a playlist.
 * Prints the list of playlists and allows the user to choose a playlist by index.
 * @param playlists - The object containing all the playlists.
 * @returns Void.
 */
function choosePlaylistMenu(playlists) {
    printPlaylists(playlists);
    rl.question("Enter the index of the playlist you want to choose: ", function (answer) {
        var index = parseInt(answer);
        if (!isNaN(index) && index > 0 && index <= Object.keys(playlists).length) {
            var playlistNames = Object.keys(playlists);
            var selectedPlaylistKey = playlistNames[index - 1];
            var selectedPlaylist = playlists[selectedPlaylistKey];
            printSongs(selectedPlaylist);
            playlistMenu(selectedPlaylist);
        }
        else {
            console.log("Invalid playlist index. Please try again.");
            choosePlaylistMenu(playlists);
        }
    });
}
/**
 * Prints the list of songs in a playlist along with their titles and artists.
 * @param playlistName - The name of the playlist.
 * @param songs - The array of songs in the playlist.
 * @returns Void.
 */
function printSongs(selectedPlaylist) {
    console.log("Songs in playlist \"".concat(selectedPlaylist.name, "\":"));
    for (var i = 0; i < selectedPlaylist.songs.length; i++) {
        console.log("".concat(selectedPlaylist.songs[i].title, " - ").concat(selectedPlaylist.songs[i].artist));
    }
}
//The same as printSongs but also adds an index to each song.
function printSongsIndex(selectedPlaylist) {
    console.log("Songs in playlist \"".concat(selectedPlaylist.name, "\":"));
    for (var i = 0; i < selectedPlaylist.songs.length; i++) {
        console.log("[".concat(i + 1, "] ").concat(selectedPlaylist.songs[i].title, " - ").concat(selectedPlaylist.songs[i].artist));
    }
}
/**
 * Prints the list of playlists along with their names.
 * @param playlists - The object containing all the playlists.
 * @returns Void.
 */
function printPlaylists(playlists) {
    console.log("Available playlists:");
    Object.keys(playlists).forEach(function (playlistName, index) {
        console.log("[".concat(index + 1, "] ").concat(playlistName));
    });
}
function playlistMenu(selectedPlaylist) {
    console.log("[1] Play");
    console.log("[2] Play specific song");
    console.log("[3] Play next song");
    console.log("[4] Play previous song");
    console.log("[5] Sort by song (A-Z)");
    console.log("[6] Sort by artist (A-Z)");
    console.log("[7] Add song to playlist");
    console.log("[8] Remove song from playlist");
    console.log("[9] Queue song");
    console.log("[10] View queued songs");
    console.log("[11] Shuffle");
    rl.question("Enter your choice: ", function (answer) {
        if (answer === '1') {
            playPlaylist(selectedPlaylist);
        }
        else if (answer === '2') {
            playSpecificSong(selectedPlaylist);
        }
        else if (answer === '3') {
            //playNextSong
        }
        else if (answer === '4') {
            playPreviousSong(selectedPlaylist);
        }
        else if (answer === '11') {
            shuffleSong(selectedPlaylist);
        }
        else if (answer === '8') {
            removeSong(selectedPlaylist);
        }
        else {
            console.log("Invalid choice. Please enter 1 or 2.");
            playlistMenu(selectedPlaylist); // Prompt again if choice is invalid
        }
    });
}
/**
 * Plays the first song in the playlist and prompts the user to navigate to the next song or return to the playlist menu.
 * @param selectedPlaylistName - The name of the selected playlist.
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
    playlistMenu(selectedPlaylist);
}
/**
 * Plays the specific song chosen by the user from the playlist and prompts the user to navigate to the next song or return to the playlist menu.
 * @param selectedPlaylistName - The name of the selected playlist.
 * @param songs - The array of songs in the playlist.
 * @returns Void.
 */
function playSpecificSong(selectedPlaylist) {
    console.log("Playlist: ".concat(selectedPlaylist.name));
    for (var i = 0; i < selectedPlaylist.songs.length; i++) {
        console.log("[".concat(i + 1, "]. ").concat(selectedPlaylist.songs[i].title, " - ").concat(selectedPlaylist.songs[i].artist));
    }
    rl.question("Enter the number of the song you wish to play: ", function (answer) {
        var songIndex = parseInt(answer);
        if (!isNaN(songIndex) && songIndex > 0 && songIndex <= selectedPlaylist.songs.length) {
            var currentSong = selectedPlaylist.songs[songIndex - 1];
            console.log("Now playing: ".concat(currentSong.title, " - ").concat(currentSong.artist));
            selectedPlaylist.currentSongIndex = songIndex - 1;
            playlistMenu(selectedPlaylist);
        }
        else {
            console.log("Invalid song number. Please try again.");
            playSpecificSong(selectedPlaylist); // Prompt again if input is invalid
        }
    });
}
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
        var currentIndex = selectedPlaylist.currentSongIndex;
        var previousSong = selectedPlaylist.songs[currentIndex - 1];
        console.log("Now playing: ".concat(previousSong.title, " - ").concat(previousSong.artist));
        selectedPlaylist.currentSongIndex = currentIndex;
    }
    playlistMenu(selectedPlaylist);
}
function removeSong(selectedPlaylist) {
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
    }
    else {
        printSongs(selectedPlaylist);
        rl.question("Enter the index of the song you want to remove: ", function (answer) {
            var songIndex = parseInt(answer);
            if (!isNaN(songIndex) && songIndex > 0 && songIndex <= Object.keys(selectedPlaylist).length) {
                selectedPlaylist.songs = selectedPlaylist.songs.slice(0, songIndex), selectedPlaylist.songs.slice(songIndex + 1);
                if (selectedPlaylist.currentSongIndex < songIndex) {
                    selectedPlaylist.currentSongIndex = selectedPlaylist.currentSongIndex - 1;
                }
            }
        });
    }
}
function shuffleSong(selectedPlaylist) {
    console.log("Now playing playlist: ".concat(selectedPlaylist));
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
    }
    else {
        var songs = selectedPlaylist.songs;
        var random_index = Math.floor(Math.random() * songs.length);
        var currentSong = songs.splice(random_index, 1)[0];
        console.log("Now playing: ".concat(currentSong.title, " - ").concat(currentSong.artist));
    }
    playlistMenu(selectedPlaylist);
}
/**
 * Plays the next song in the playlist.
 * @param playlist - The playlist.
 *
function playNextSong(playlist: Playlist, songQueue: SongQueue): Playlist {
    if (is_empty_queue(songQueue)) {
        const currentIndex = playlist.currentSongIndex;
        if (playlist.songs[currentIndex] === playlist.songs[-1]) {
            const currentIndex = 0;
            const currentSong = playlist.songs[currentIndex];

            console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');

            return {...playlist, currentSongIndex: currentIndex};
        } else {
            const currentSong = playlist.songs[currentIndex + 1];
            console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');

            return {...playlist, currentSongIndex: currentIndex + 1};
        }

    
    } else {
        const currentSong = qhead(songQueue);
        dequeue(songQueue);
        console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');
        return playlist;
    }
}
*/
function makePlaylistMenu() {
    console.log("Make a new playlist");
    rl.question("Give the playlist a name: ", function (name) {
        console.log("Playlist name: " + name);
        // Handle creating playlist here
        rl.close();
    });
}
mainMenu();
