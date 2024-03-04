"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helperFunctions_1 = require("./controllers/helperFunctions");
const types_and_constants_1 = require("./types and constants");
const playControllers_1 = require("./controllers/playControllers");
const playlistControllers_1 = require("./controllers/playlistControllers");
describe('test search song database', () => {
    const song1 = { title: "Money", artist: "Pink Floyd", album: "Dark side of the moon", collaborators: [] };
    const song2 = { title: "Giant Steps", artist: "John Coltrane", album: "Giant Steps", collaborators: [] };
    const song3 = { title: "Naima", artist: "John Coltrane", album: "Giant Steps", collaborators: [] };
    const song4 = { title: "In 'N Out", artist: "Joe Henderson", album: "In 'N Out", collaborators: [] };
    const song5 = { title: "So What", artist: "Miles Davis", album: "Kind Of Blue", collaborators: ["John Coltrane", "Cannonball Adderley", "Bill Evans"] };
    const songdatabase = { songs: [song1, song2, song3, song4, song5] };
    const emptySongDatabase = { songs: [] };
    test('search after pink floyd in songdatabase', () => {
        const result = (0, helperFunctions_1.searchSongDatabase)(songdatabase, "pink floyd");
        expect(result).toEqual([song1]);
    });
    test('search after pink floyd in empty database', () => {
        const result = (0, helperFunctions_1.searchSongDatabase)(emptySongDatabase, "pink floyd");
        expect(result).toEqual([]);
    });
    test('search after coltrane in songdatabase, should also handle song 5 since coltrane is a collaborator', () => {
        const result = (0, helperFunctions_1.searchSongDatabase)(songdatabase, "coltrane");
        expect(result).toEqual([song2, song3, song5]);
    });
    test('search after song title naima in songdatabase', () => {
        const result = (0, helperFunctions_1.searchSongDatabase)(songdatabase, "naima");
        expect(result).toEqual([song3]);
    });
    test('search after nothing empty string in songdatabase', () => {
        const result = (0, helperFunctions_1.searchSongDatabase)(songdatabase, "");
        expect(result).toEqual([]);
    });
});
describe('test for loadPlaylist', () => {
    test('try to load the playlist', () => {
        const playlists = (0, types_and_constants_1.loadPlaylists)();
        expect(playlists).toBeDefined;
    });
});
describe('test for loadSongdata', () => {
    test('try to load the playlist', () => {
        const songsdata = (0, types_and_constants_1.loadSongs)();
        expect(songsdata).toBeDefined;
    });
});
describe('test for removeSongHelper', () => {
    const song = { title: "Money", artist: "Pink Floyd", album: "Dark side of the moon", collaborators: [] };
    let playlist = { name: "jazz", songs: [song], currentSongIndex: -1 };
    test('test to remove first song from a playlist', () => {
        (0, playlistControllers_1.removeSongHelper)(playlist, 1);
        expect(playlist.songs).toEqual([]);
    });
});
describe('test for playPlaylist', () => {
    const song1 = { title: "Money", artist: "Pink Floyd", album: "Dark side of the moon", collaborators: [] };
    const song2 = { title: "Giant Steps", artist: "John Coltrane", album: "Giant Steps", collaborators: [] };
    const song3 = { title: "Naima", artist: "John Coltrane", album: "Giant Steps", collaborators: [] };
    const song4 = { title: "In 'N Out", artist: "Joe Henderson", album: "In 'N Out", collaborators: [] };
    const song5 = { title: "So What", artist: "Miles Davis", album: "Kind Of Blue", collaborators: ["John Coltrane", "Cannonball Adderley", "Bill Evans"] };
    let playlist = { name: "jazz", songs: [song1, song2, song3, song4, song5], currentSongIndex: -1 };
    let playlistCopy = { name: "jazz", songs: [song1, song2, song3, song4, song5], currentSongIndex: -1 };
    test('ensure that currentSongIndex is set to 0', () => {
        (0, playControllers_1.playPlaylist)(playlist);
        expect(playlist.currentSongIndex).toEqual(0);
    });
    test('ensure that all songs remain unchange', () => {
        (0, playControllers_1.playPlaylist)(playlist);
        expect(playlist.songs).toEqual(playlistCopy.songs);
        expect(playlist.name).toEqual(playlistCopy.name);
    });
});
describe('test for playNextSong', () => {
    const song1 = { title: "Money", artist: "Pink Floyd", album: "Dark side of the moon", collaborators: [] };
    const song2 = { title: "Giant Steps", artist: "John Coltrane", album: "Giant Steps", collaborators: [] };
    const song3 = { title: "Naima", artist: "John Coltrane", album: "Giant Steps", collaborators: [] };
    const song4 = { title: "In 'N Out", artist: "Joe Henderson", album: "In 'N Out", collaborators: [] };
    const song5 = { title: "So What", artist: "Miles Davis", album: "Kind Of Blue", collaborators: ["John Coltrane", "Cannonball Adderley", "Bill Evans"] };
    let playlistIndex4 = { name: "jazz", songs: [song1, song2, song3, song4, song5], currentSongIndex: 4 };
    let emptyPlaylist = { name: "jazz", songs: [], currentSongIndex: -1 };
    let songQueue = { name: "songQueue", songs: [song1], currentSongIndex: -1 };
    let emptySongQueue = { name: "songQueue", songs: [song1], currentSongIndex: -1 };
    let playlists = { songQueue: songQueue };
    let playlistsWithEmptyQueue = { songQueue: emptySongQueue };
    test('test to play next song if there is song in queue', () => {
        let playlistIndex1 = { name: "jazz", songs: [song1, song2, song3, song4, song5], currentSongIndex: 1 };
        (0, playControllers_1.playNextSong)(playlistIndex1, playlists);
        expect(playlists.songQueue.songs).toEqual([]);
        expect(playlistIndex1.currentSongIndex).toEqual(1);
    });
    test('test to play next song with no song in queue', () => {
        let playlistIndex2 = { name: "jazz", songs: [song1, song2, song3, song4, song5], currentSongIndex: 2 };
        (0, playControllers_1.playNextSong)(playlistIndex2, playlistsWithEmptyQueue);
        expect(playlistIndex2.currentSongIndex).toEqual(3);
    });
    test('test to play next song from last song, should loop around and set currentSongIndex to 0', () => {
        (0, playControllers_1.playNextSong)(playlistIndex4, playlistsWithEmptyQueue);
        expect(playlistIndex4.currentSongIndex).toEqual(0);
    });
    test('play next song on empty playlist should not change the current song index', () => {
        (0, playControllers_1.playNextSong)(emptyPlaylist, playlistsWithEmptyQueue);
        expect(emptyPlaylist.currentSongIndex).toEqual(-1);
    });
});
describe('test for shuffleSong', () => {
});
describe('test for playPreviousSong', () => {
});
