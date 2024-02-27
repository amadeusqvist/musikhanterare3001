"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var queue_array_1 = require("./lib/queue_array");
var PromptSync = require("prompt-sync");
var prompt = PromptSync({ sigint: true });
;
/**
 * Creates a fresh playlist.
 * @returns An empty playlist.
 */
function createEmptyPlaylist(nameOfPlaylist) {
    return {
        name: nameOfPlaylist,
        songs: [],
        currentSongIndex: -1,
    };
}
/**
 * Adds a song to the playlist.
 * @precondition The song is not empty.
 * @param playlist - The playlist.
 * @param song - The song to be added.
 * @returns The updated playlist.
 */
function addSong(playlist, searchTerm, songDatabase) {
    var updatedSongs = playlist.songs.concat();
    return __assign(__assign({}, playlist), { songs: updatedSongs });
}
/**
 * Removes a song from the playlist.
 * @precondition The songIndex is smaller than the length of the playlist.
 * @param playlist - The playlist.
 * @param songIndex - The index of the song to be removed.
 * @returns The updated playlist.
 */
function removeSong(playlist, songIndex) {
    var updatedSongs = __spreadArray(__spreadArray([], playlist.songs.slice(0, songIndex), true), playlist.songs.slice(songIndex + 1), true);
    return __assign(__assign({}, playlist), { songs: updatedSongs });
}
/**
 * Always plays the first song in the playlist.
 * @param playlist - The playlist.
 */
function playPlaylist(playlist) {
    if (playlist.songs === null) {
        console.log('Playlist is empty');
        return playlist;
    }
    var currentSong = playlist.songs[0];
    playlist.currentSongIndex = 0;
    console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');
    return playlist;
}
function playSpecificSong(playlist, songIndex) {
    console.log('${playlist.name}');
    for (var i = 0; i < playlist.songs.length; i = i + 1) {
        console.log('[${i}]. ${playlist.songs[i].title} - ${playlist.songs[i].artist}');
    }
    var userInput = prompt('Enter the number of the song you wish to play: ');
    var songNumber = parseInt(userInput);
    if (isNaN(songNumber) || songNumber < 1 || songNumber > playlist.songs.length) {
        console.log('Invalid song number.');
        return playlist;
    }
    // Set the current song index
    var currentSongIndex = songNumber - 1;
    var currentSong = playlist.songs[currentSongIndex];
    // Display currently playing song
    console.log('Currently playing: ${currentSong.title} - ${currentSong.artist}');
    return __assign(__assign({}, playlist), { currentSongIndex: currentSongIndex });
}
/**
 * Plays the next song in the playlist.
 * @param playlist - The playlist.
 */
function playNextSong(playlist, songQueue) {
    if ((0, queue_array_1.is_empty)(songQueue)) {
        var currentIndex = playlist.currentSongIndex;
        if (playlist.songs[currentIndex] === playlist.songs[-1]) {
            var currentIndex_1 = 0;
            var currentSong = playlist.songs[currentIndex_1];
            console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');
            return __assign(__assign({}, playlist), { currentSongIndex: currentIndex_1 });
        }
        else {
            var currentSong = playlist.songs[currentIndex + 1];
            console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');
            return __assign(__assign({}, playlist), { currentSongIndex: currentIndex + 1 });
        }
    }
    else {
        var currentSong = (0, queue_array_1.head)(songQueue);
        (0, queue_array_1.dequeue)(songQueue);
        console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');
        return playlist;
    }
}
/**
 * Plays the previous song in the playlist.
 * @param playlist - The playlist.
 */
function playPreviousSong(playlist) {
    if (playlist.currentSongIndex === 0) {
        var currentIndex = playlist.songs.length;
        var currentSong = playlist.songs[currentIndex];
        console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');
        return __assign(__assign({}, playlist), { currentSongIndex: currentIndex });
    }
    else {
        var currentIndex = playlist.currentSongIndex - 1;
        var currentSong = playlist.songs[currentIndex];
        console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');
        return __assign(__assign({}, playlist), { currentSongIndex: currentIndex });
    }
}
/**
 * Searches the database for songs.
 * @param database - The songdatabase.
 * @param searchTerm - The searchterm may be the title or the artist
 * @returns An array of songs matching the search criteria.
 */
function searchSongDatabase(songDatabase, searchTerm) {
    var matchingSongs = [];
    var lowercaseSearchTerm = searchTerm.toLowerCase();
    for (var songId in songDatabase.songs) {
        var song = songDatabase.songs[songId];
        var lowercaseTitle = song.title.toLowerCase();
        var lowercaseArtist = song.artist.toLowerCase();
        if (lowercaseTitle.includes(lowercaseSearchTerm, undefined) ||
            lowercaseArtist.includes(lowercaseSearchTerm) ||
            song.collaborators.some(function (collaborator) {
                return collaborator.toLowerCase().includes(lowercaseSearchTerm);
            })) {
            matchingSongs.push(song);
        }
    }
    return matchingSongs;
}
// Shuffel och sökning ska vara på plats
// Josn låtar och artister
// Testfall för sökning
// Shuffel för test
// En bra LaTeX
// DOKUMENTATION I LATEX
// Byta ordning
// Byta mellan olika
// Lägga till flera låtar
// Shuffla spelista, kön
// Om man både vill ha snabb sök och upplslag på låtar och skulle spara det i olika tabeller, 
// nackdelen är att man duplicerar datan och den sparas på två ställen. Säga att spotify tar bort en artist
// från spotify så måste de ta bort från flera ställen. Enkelt att hitta datan genom att duplicera data.
// Hårdkorda alla tabeller i en json fil
