"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helperFunctions_1 = require("./controllers/helperFunctions");
const types_and_constants_1 = require("./types and constants");
const playControllers_1 = require("./controllers/playControllers");
const playlistControllers_1 = require("./controllers/playlistControllers");
const spotify_api_1 = require("./spotify-api");
describe('Search Song Database', () => {
    const song1 = { title: 'Money', artist: 'Pink Floyd', album: 'Dark side of the moon', collaborators: [] };
    const song2 = { title: 'Giant Steps', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song3 = { title: 'Naima', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song4 = { title: "In 'N Out", artist: 'Joe Henderson', album: "In 'N Out", collaborators: [] };
    const song5 = { title: 'So What', artist: 'Miles Davis', album: 'Kind Of Blue', collaborators: ['John Coltrane'] };
    const songDatabase = { songs: [song1, song2, song3, song4, song5] };
    const emptySongDatabase = { songs: [] };
    test('should find songs by artist "Pink Floyd"', () => {
        const result = (0, helperFunctions_1.searchSongDatabase)(songDatabase, 'Pink Floyd');
        expect(result).toEqual([song1]);
    });
    test('should not find songs in an empty database', () => {
        const result = (0, helperFunctions_1.searchSongDatabase)(emptySongDatabase, 'Pink Floyd');
        expect(result).toEqual([]);
    });
    test('should find songs by artist "Coltrane", including the one with Coltrane as a collaborator', () => {
        const result = (0, helperFunctions_1.searchSongDatabase)(songDatabase, 'Coltrane');
        expect(result).toEqual([song2, song3, song5]);
    });
    test('should find songs by title "Naima"', () => {
        const result = (0, helperFunctions_1.searchSongDatabase)(songDatabase, 'Naima');
        expect(result).toEqual([song3]);
    });
    test('should return an empty array when searching with an empty string', () => {
        const result = (0, helperFunctions_1.searchSongDatabase)(songDatabase, '');
        expect(result).toEqual([]);
    });
});
describe('Load Playlist', () => {
    test('should load playlists', () => {
        const playlists = (0, types_and_constants_1.loadPlaylists)();
        expect(playlists).toBeDefined();
    });
});
describe('Load Song Data', () => {
    test('should load songs data', () => {
        const songsdata = (0, types_and_constants_1.loadSongs)();
        expect(songsdata).toBeDefined();
    });
});
describe('Remove Song Helper', () => {
    const song = { title: 'Money', artist: 'Pink Floyd', album: 'Dark side of the moon', collaborators: [] };
    let playlist = { name: 'jazz', songs: [song], currentSongIndex: -1 };
    test('should remove the first song from a playlist', () => {
        (0, playlistControllers_1.removeSongHelper)(playlist, 1);
        expect(playlist.songs).toEqual([]);
    });
});
describe('Play Playlist', () => {
    const song1 = { title: 'Money', artist: 'Pink Floyd', album: 'Dark side of the moon', collaborators: [] };
    const song2 = { title: 'Giant Steps', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song3 = { title: 'Naima', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song4 = { title: "In 'N Out", artist: 'Joe Henderson', album: "In 'N Out", collaborators: [] };
    const song5 = { title: 'So What', artist: 'Miles Davis', album: 'Kind Of Blue', collaborators: ['John Coltrane'] };
    let playlist = { name: 'jazz', songs: [song1, song2, song3, song4, song5], currentSongIndex: -1 };
    let playlistCopy = { name: 'jazz', songs: [song1, song2, song3, song4, song5], currentSongIndex: -1 };
    test('should set currentSongIndex to 0', () => {
        (0, playControllers_1.playPlaylist)(playlist);
        expect(playlist.currentSongIndex).toEqual(0);
    });
    test('should keep all songs unchanged', () => {
        (0, playControllers_1.playPlaylist)(playlist);
        expect(playlist.songs).toEqual(playlistCopy.songs);
        expect(playlist.name).toEqual(playlistCopy.name);
    });
});
describe('Play Next Song', () => {
    const song1 = { title: 'Money', artist: 'Pink Floyd', album: 'Dark side of the moon', collaborators: [] };
    const song2 = { title: 'Giant Steps', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song3 = { title: 'Naima', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song4 = { title: "In 'N Out", artist: 'Joe Henderson', album: "In 'N Out", collaborators: [] };
    const song5 = { title: 'So What', artist: 'Miles Davis', album: 'Kind Of Blue', collaborators: ['John Coltrane'] };
    let songQueue = { name: 'songQueue', songs: [song1], currentSongIndex: -1 };
    let emptySongQueue = { name: 'songQueue', songs: [], currentSongIndex: -1 };
    let playlists = { songQueue: songQueue };
    let playlistsWithEmptyQueue = { songQueue: emptySongQueue };
    test('should play the next song if there is a song in the queue', () => {
        let playlistIndex1 = { name: 'jazz', songs: [song1, song2, song3, song4, song5], currentSongIndex: 1 };
        (0, playControllers_1.playNextSong)(playlistIndex1, playlists);
        expect(playlists.songQueue.songs).toEqual([]);
        expect(playlistIndex1.currentSongIndex).toEqual(1);
    });
    test('should play the next song with no song in the queue', () => {
        let playlistIndex2 = { name: 'jazz', songs: [song1, song2, song3, song4, song5], currentSongIndex: 2 };
        (0, playControllers_1.playNextSong)(playlistIndex2, playlistsWithEmptyQueue);
        expect(playlistIndex2.currentSongIndex).toEqual(3);
    });
    test('should play the next song from the last song, should loop around and set currentSongIndex to 0', () => {
        let playlistIndex4 = { name: 'jazz', songs: [song1, song2, song3, song4, song5], currentSongIndex: 4 };
        (0, playControllers_1.playNextSong)(playlistIndex4, playlistsWithEmptyQueue);
        expect(playlistIndex4.currentSongIndex).toEqual(0);
    });
    test('should not change the current song index on an empty playlist', () => {
        let emptyPlaylist = { name: 'jazz', songs: [], currentSongIndex: -1 };
        (0, playControllers_1.playNextSong)(emptyPlaylist, playlistsWithEmptyQueue);
        expect(emptyPlaylist.currentSongIndex).toEqual(-1);
    });
});
describe('Shuffle Song', () => {
    test('should keep currentSongIndex the same if shuffle is called with an empty playlist', () => {
        let playlistIndex1 = { name: 'jazz', songs: [], currentSongIndex: 1 };
        (0, playControllers_1.shuffleSong)(playlistIndex1);
        expect(playlistIndex1.currentSongIndex).toEqual(1);
    });
});
describe('Play Previous Song', () => {
    const song1 = { title: 'Money', artist: 'Pink Floyd', album: 'Dark side of the moon', collaborators: [] };
    const song2 = { title: 'Giant Steps', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song3 = { title: 'Naima', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song4 = { title: "In 'N Out", artist: 'Joe Henderson', album: "In 'N Out", collaborators: [] };
    const song5 = { title: 'So What', artist: 'Miles Davis', album: 'Kind Of Blue', collaborators: ['John Coltrane'] };
    test('should play the previous song from the first song, should loop around and set currentSongIndex to 4', () => {
        let playlistIndex0 = { name: 'jazz', songs: [song1, song2, song3, song4, song5], currentSongIndex: 0 };
        (0, playControllers_1.playPreviousSong)(playlistIndex0);
        expect(playlistIndex0.currentSongIndex).toEqual(4);
    });
    test('should not change the current song index on an empty playlist', () => {
        let emptyPlaylist = { name: 'jazz', songs: [], currentSongIndex: -1 };
        (0, playControllers_1.playPreviousSong)(emptyPlaylist);
        expect(emptyPlaylist.currentSongIndex).toEqual(-1);
    });
});
describe('Add Song Helper', () => {
    const song1 = { title: 'Money', artist: 'Pink Floyd', album: 'Dark side of the moon', collaborators: [] };
    const song2 = { title: 'Giant Steps', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song3 = { title: 'Naima', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song4 = { title: "In 'N Out", artist: 'Joe Henderson', album: "In 'N Out", collaborators: [] };
    const song5 = { title: 'So What', artist: 'Miles Davis', album: 'Kind Of Blue', collaborators: ['John Coltrane'] };
    test('should add song2 to an empty playlist', () => {
        let emptyPlaylist = { name: 'jazz', songs: [], currentSongIndex: -1 };
        let matchingSongs = [song1, song2, song3, song4, song5];
        (0, playlistControllers_1.addSongHelper)(emptyPlaylist, matchingSongs, 2);
        expect(emptyPlaylist.songs).toEqual([song2]);
    });
    test('should add a song to the end of a playlist with songs', () => {
        let playlistWithSongs = { name: 'jazz', songs: [song1, song2, song3], currentSongIndex: -1 };
        let matchingSongs = [song4, song5];
        (0, playlistControllers_1.addSongHelper)(playlistWithSongs, matchingSongs, 1);
        expect(playlistWithSongs.songs).toEqual([song1, song2, song3, song4]);
    });
});
describe('Create Song', () => {
    test('should create a song', () => {
        const song = { title: 'So What', artist: 'Miles Davis', album: 'Kind Of Blue', collaborators: ['John Coltrane'] };
        const new_song = (0, spotify_api_1.createSong)('So What', 'Miles Davis', 'Kind Of Blue', ['John Coltrane']);
        expect(new_song).toEqual(song);
    });
});
describe('Add song to Playlist', () => {
    const song1 = { title: 'Money', artist: 'Pink Floyd', album: 'Dark side of the moon', collaborators: [] };
    const song2 = { title: 'Giant Steps', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song3 = { title: 'Naima', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song4 = { title: "In 'N Out", artist: 'Joe Henderson', album: "In 'N Out", collaborators: [] };
    const song5 = { title: 'So What', artist: 'Miles Davis', album: 'Kind Of Blue', collaborators: ['John Coltrane'] };
    let playlist1 = { name: 'Jazz', songs: [song1, song2, song3, song4], currentSongIndex: -1 };
    let playlist2 = { name: 'Pop', songs: [], currentSongIndex: -1 };
    let playlists = { Jazz: playlist1, Pop: playlist2 };
    test('should add song5 to ', () => {
        expect(playlists.pop.songs).not.toContain(song5);
        (0, spotify_api_1.addTrackToPlaylist)("Pop", song5, playlists);
        expect(playlists.pop.songs).toContain(song5);
    });
});
describe('Add song to Song Database', () => {
    const song1 = { title: 'Money', artist: 'Pink Floyd', album: 'Dark side of the moon', collaborators: [] };
    const song2 = { title: 'Giant Steps', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song3 = { title: 'Naima', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song4 = { title: "In 'N Out", artist: 'Joe Henderson', album: "In 'N Out", collaborators: [] };
    const song5 = { title: 'So What', artist: 'Miles Davis', album: 'Kind Of Blue', collaborators: ['John Coltrane'] };
    const songDatabase = { songs: [song1, song2, song3, song4] };
    test('should add a song to the song DB', () => {
        expect(songDatabase.songs).not.toContain(song5);
        (0, spotify_api_1.addTrackToSongDb)(song5, songDatabase);
        expect(songDatabase.songs).toContain(song5);
    });
});
