import {searchSongDatabase} from './controllers/helperFunctions'
import {type Playlist, type Song, type SongDatabase, type PlaylistData, loadPlaylists, loadSongs} from './types and constants'
import {playPlaylist, playNextSong, playPreviousSong, playSpecificSong} from './controllers/playControllers'
import { removeSongHelper } from './controllers/playlistControllers';

describe('test search song database', () => {
    const song1: Song = { title: "Money", artist: "Pink Floyd", album: "Dark side of the moon", collaborators: [] };
    const song2: Song = { title: "Giant Steps", artist: "John Coltrane", album: "Giant Steps", collaborators: [] };
    const song3: Song = { title: "Naima", artist: "John Coltrane", album: "Giant Steps", collaborators: [] };
    const song4: Song = { title: "In 'N Out", artist: "Joe Henderson", album: "In 'N Out", collaborators: [] };
    const song5: Song = { title: "So What", artist: "Miles Davis", album: "Kind Of Blue", collaborators: ["John Coltrane", "Cannonball Adderley", "Bill Evans"] };

    const songdatabase: SongDatabase = {songs: [song1, song2, song3, song4, song5]};
    const emptySongDatabase: SongDatabase = {songs: []};
    
    test('search after pink floyd in songdatabase', () => {
        const result = searchSongDatabase(songdatabase, "pink floyd");
        expect(result).toEqual([song1]);
    });

    test('search after pink floyd in empty database', () => {
        const result = searchSongDatabase(emptySongDatabase, "pink floyd");
        expect(result).toEqual([]);
    });

    test('search after coltrane in songdatabase, should also handle song 5 since coltrane is a collaborator', () => {
        const result = searchSongDatabase(songdatabase, "coltrane");
        expect(result).toEqual([song2, song3, song5]);
    });

    test('search after song title naima in songdatabase', () => {
        const result = searchSongDatabase(songdatabase, "naima");
        expect(result).toEqual([song3]);
    });

    test('search after nothing empty string in songdatabase', () => {
        const result = searchSongDatabase(songdatabase, "");
        expect(result).toEqual([]);
    });
});

describe('test for loadPlaylist', () => {
    test('try to load the playlist', () => {
        const playlists = loadPlaylists();
        expect(playlists).toBeDefined;
    });
});

describe('test for loadSongdata', () => {
    test('try to load the playlist', () => {
        const songsdata = loadSongs();
        expect(songsdata).toBeDefined;
    });
});

describe('test for removeSongHelper', () => {
    const song: Song = {title: "Money", artist: "Pink Floyd", album: "Dark side of the moon", collaborators: []}
    let playlist: Playlist = {name: "jazz", songs: [song], currentSongIndex: -1};

    test('test to remove first song from a playlist', () => {
        removeSongHelper(playlist, 1);
        expect(playlist.songs).toEqual([]);
    });

});

describe('test for playPlaylist', () => {

    const song1: Song = { title: "Money", artist: "Pink Floyd", album: "Dark side of the moon", collaborators: [] };
    const song2: Song = { title: "Giant Steps", artist: "John Coltrane", album: "Giant Steps", collaborators: [] };
    const song3: Song = { title: "Naima", artist: "John Coltrane", album: "Giant Steps", collaborators: [] };
    const song4: Song = { title: "In 'N Out", artist: "Joe Henderson", album: "In 'N Out", collaborators: [] };
    const song5: Song = { title: "So What", artist: "Miles Davis", album: "Kind Of Blue", collaborators: ["John Coltrane", "Cannonball Adderley", "Bill Evans"] };

    let playlist: Playlist = {name: "jazz", songs: [song1, song2, song3, song4, song5], currentSongIndex: -1};
    let playlistCopy: Playlist = {name: "jazz", songs: [song1, song2, song3, song4, song5], currentSongIndex: -1};

    test('ensure that currentSongIndex is set to 0', () => {
        playPlaylist(playlist);
        expect(playlist.currentSongIndex).toEqual(0);
    });

    test('ensure that all songs remain unchange', () => {
        playPlaylist(playlist);
        expect(playlist.songs).toEqual(playlistCopy.songs);
        expect(playlist.name).toEqual(playlistCopy.name);
    });

});

describe('test for playNextSong', () => {
    const song1: Song = { title: "Money", artist: "Pink Floyd", album: "Dark side of the moon", collaborators: [] };
    const song2: Song = { title: "Giant Steps", artist: "John Coltrane", album: "Giant Steps", collaborators: [] };
    const song3: Song = { title: "Naima", artist: "John Coltrane", album: "Giant Steps", collaborators: [] };
    const song4: Song = { title: "In 'N Out", artist: "Joe Henderson", album: "In 'N Out", collaborators: [] };
    const song5: Song = { title: "So What", artist: "Miles Davis", album: "Kind Of Blue", collaborators: ["John Coltrane", "Cannonball Adderley", "Bill Evans"] };

    let playlistIndex4: Playlist = {name: "jazz", songs: [song1, song2, song3, song4, song5], currentSongIndex: 4};
    let emptyPlaylist: Playlist = {name: "jazz", songs: [], currentSongIndex: -1};
    let songQueue: Playlist = {name: "songQueue", songs: [song1], currentSongIndex: -1};
    let emptySongQueue: Playlist = {name: "songQueue", songs: [song1], currentSongIndex: -1};

    let playlists: PlaylistData = {songQueue: songQueue};
    let playlistsWithEmptyQueue: PlaylistData = {songQueue: emptySongQueue};

    test('test to play next song if there is song in queue', () => {
        let playlistIndex1: Playlist = {name: "jazz", songs: [song1, song2, song3, song4, song5], currentSongIndex: 1};

        playNextSong(playlistIndex1, playlists);
        expect(playlists.songQueue.songs).toEqual([]);
        expect(playlistIndex1.currentSongIndex).toEqual(1);
    });

    /*
    test('test to play next song with no song in queue', () => {
        let playlistIndex2: Playlist = {name: "jazz", songs: [song1, song2, song3, song4, song5], currentSongIndex: 2};

        playNextSong(playlistIndex2, playlistsWithEmptyQueue);
        expect(playlistIndex2.currentSongIndex).toEqual(3);
    });
    **/

    test('test to play next song from last song, should loop around and set currentSongIndex to 0', () => {
        playNextSong(playlistIndex4, playlistsWithEmptyQueue);
        expect(playlistIndex4.currentSongIndex).toEqual(0);
    });

    test('play next song on empty playlist should not change the current song index', () => {
        playNextSong(emptyPlaylist, playlistsWithEmptyQueue);
        expect(emptyPlaylist.currentSongIndex).toEqual(-1);
    });
});

describe('test for shuffleSong', () => {

});

describe('test for playPreviousSong', () => {

});

