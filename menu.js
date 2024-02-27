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
function choosePlaylistMenu(playlists) {
    printPlaylists(playlists);
    rl.question("Enter the index of the playlist you want to choose: ", function (answer) {
        var index = parseInt(answer);
        if (!isNaN(index) && index > 0 && index <= Object.keys(playlists).length) {
            var playlistNames = Object.keys(playlists);
            var selectedPlaylistName = playlistNames[index - 1];
            var selectedPlaylist = playlists[selectedPlaylistName];
            printSongs(selectedPlaylistName, selectedPlaylist.songs);
            playlistMenu(selectedPlaylistName, selectedPlaylist.songs); // Pass playlist name and songs as arguments
        }
        else {
            console.log("Invalid playlist index. Please try again.");
            choosePlaylistMenu(playlists);
        }
    });
}
function printSongs(playlistName, songs) {
    console.log("Songs in playlist \"".concat(playlistName, "\":"));
    for (var i = 0; i < songs.length; i++) {
        console.log("[$".concat(songs[i].title, " - ").concat(songs[i].artist));
    }
}
function printSongsIndex(playlistName, songs) {
    console.log("Songs in playlist \"".concat(playlistName, "\":"));
    for (var i = 0; i < songs.length; i++) {
        console.log("[".concat(i + 1, "]. ").concat(songs[i].title, " - ").concat(songs[i].artist));
    }
}
function printPlaylists(playlists) {
    console.log("Available playlists:");
    Object.keys(playlists).forEach(function (playlistName, index) {
        console.log("[".concat(index + 1, "] ").concat(playlistName));
    });
}
function playlistMenu(selectedPlaylistName, songs) {
    console.log("[1] Play");
    console.log("[2] Play specific song");
    rl.question("Enter your choice: ", function (answer) {
        if (answer === '1') {
            playPlaylist(selectedPlaylistName, songs);
        }
        else if (answer === '2') {
            playSpecificSong(selectedPlaylistName, songs);
        }
        else {
            console.log("Invalid choice. Please enter 1 or 2.");
            playlistMenu(selectedPlaylistName, songs); // Prompt again if choice is invalid
        }
    });
}
function playPlaylist(selectedPlaylistName, songs) {
    console.log("Now playing playlist: ".concat(selectedPlaylistName));
    if (songs.length === 0) {
        console.log("Playlist is empty.");
    }
    else {
        var currentSong = songs[0];
        console.log("Now playing: ".concat(currentSong.title, " - ").concat(currentSong.artist));
    }
    playlistMenu(selectedPlaylistName, songs);
}
function playSpecificSong(selectedPlaylistName, songs) {
    console.log("Playlist: ".concat(selectedPlaylistName));
    for (var i = 0; i < songs.length; i++) {
        console.log("[".concat(i + 1, "]. ").concat(songs[i].title, " - ").concat(songs[i].artist));
    }
    rl.question("Enter the number of the song you wish to play: ", function (answer) {
        var songNumber = parseInt(answer);
        if (!isNaN(songNumber) && songNumber > 0 && songNumber <= songs.length) {
            var currentSong = songs[songNumber - 1];
            console.log("Now playing: ".concat(currentSong.title, " - ").concat(currentSong.artist));
            playlistMenu(selectedPlaylistName, songs);
        }
        else {
            console.log("Invalid song number. Please try again.");
            playSpecificSong(selectedPlaylistName, songs); // Prompt again if input is invalid
        }
    });
}
function makePlaylistMenu() {
    console.log("Make a new playlist");
    rl.question("Give the playlist a name: ", function (name) {
        console.log("Playlist name: " + name);
        // Handle creating playlist here
        rl.close();
    });
}
mainMenu();
