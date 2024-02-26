"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var fs = require("fs");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function mainMenu() {
    console.log("[1] Choose Playlist");
    console.log("[2] Make Playlist");
    rl.question("Enter your choice: ", function (answer) {
        if (answer === '1') {
            choosePlaylistMenu();
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
// Läs in spellistor från JSON-fil
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
// Skriv ut spellistor och deras index
function printPlaylists(playlists) {
    console.log("Choose a playlist:");
    var index = 1;
    for (var playlistName in playlists) {
        console.log("[".concat(index, "] ").concat(playlistName));
        index++;
    }
}
// Skriv ut låtarna i en spellista med deras index
function printSongs(playlistName, playlist) {
    console.log("Songs in ".concat(playlistName, ":"));
    for (var songIndex in playlist) {
        var song = playlist[songIndex];
        console.log("[".concat(songIndex, "] ").concat(song.title, " - ").concat(song.artist));
    }
}
// Funktion för att välja en spellista och skriva ut dess låtar
function choosePlaylistMenu() {
    var playlists = loadPlaylists();
    printPlaylists(playlists);
    rl.question("Enter the index of the playlist you want to choose: ", function (answer) {
        var index = parseInt(answer);
        if (!isNaN(index) && index > 0 && index <= Object.keys(playlists).length) {
            var playlistNames = Object.keys(playlists);
            var selectedPlaylistName = playlistNames[index - 1];
            var selectedPlaylist = playlists[selectedPlaylistName];
            printSongs(selectedPlaylistName, selectedPlaylist);
        }
        else {
            console.log("Invalid playlist index. Please try again.");
            choosePlaylistMenu();
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
