import {searchSongDatabase} from './controllers/helperFunctions'
import {type Playlist, type Song, type SongDatabase, type PlaylistData, loadPlaylists, loadSongs} from './types and constants'
import {playPlaylist, playNextSong, playPreviousSong, shuffleSong} from './controllers/playControllers'
import { removeSongHelper, addSongHelper } from './controllers/playlistControllers';

describe('Search Song Database', () => {
    const song1: Song = { title: 'Money', artist: 'Pink Floyd', album: 'Dark side of the moon', collaborators: [] };
    const song2: Song = { title: 'Giant Steps', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song3: Song = { title: 'Naima', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song4: Song = { title: "In 'N Out", artist: 'Joe Henderson', album: "In 'N Out", collaborators: [] };
    const song5: Song = { title: 'So What', artist: 'Miles Davis', album: 'Kind Of Blue', collaborators: ['John Coltrane']};
  
    const songDatabase: SongDatabase = { songs: [song1, song2, song3, song4, song5] };
    const emptySongDatabase: SongDatabase = { songs: [] };
  
    test('should find songs by artist "Pink Floyd"', () => {
        const result = searchSongDatabase(songDatabase, 'Pink Floyd');
        expect(result).toEqual([song1]);
    });
  
    test('should not find songs in an empty database', () => {
        const result = searchSongDatabase(emptySongDatabase, 'Pink Floyd');
        expect(result).toEqual([]);
    });
  
    test('should find songs by artist "Coltrane", including the one with Coltrane as a collaborator', () => {
        const result = searchSongDatabase(songDatabase, 'Coltrane');
        expect(result).toEqual([song2, song3, song5]);
    });
  
    test('should find songs by title "Naima"', () => {
        const result = searchSongDatabase(songDatabase, 'Naima');
        expect(result).toEqual([song3]);
    });
  
    test('should return an empty array when searching with an empty string', () => {
        const result = searchSongDatabase(songDatabase, '');
        expect(result).toEqual([]);
    });
});

describe('Load Playlist', () => {
    test('should load playlists', () => {
        const playlists = loadPlaylists();
        expect(playlists).toBeDefined();
    });
});
  
describe('Load Song Data', () => {
    test('should load songs data', () => {
        const songsdata = loadSongs();
        expect(songsdata).toBeDefined();
    });
});

describe('Remove Song Helper', () => {
    const song: Song = { title: 'Money', artist: 'Pink Floyd', album: 'Dark side of the moon', collaborators: [] };
    let playlist: Playlist = { name: 'jazz', songs: [song], currentSongIndex: -1 };
  
    test('should remove the first song from a playlist', () => {
        removeSongHelper(playlist, 1);
        expect(playlist.songs).toEqual([]);
    });
});

describe('Play Playlist', () => {
    const song1: Song = { title: 'Money', artist: 'Pink Floyd', album: 'Dark side of the moon', collaborators: [] };
    const song2: Song = { title: 'Giant Steps', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song3: Song = { title: 'Naima', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song4: Song = { title: "In 'N Out", artist: 'Joe Henderson', album: "In 'N Out", collaborators: [] };
    const song5: Song = { title: 'So What', artist: 'Miles Davis', album: 'Kind Of Blue', collaborators: ['John Coltrane']};
  
    let playlist: Playlist = { name: 'jazz', songs: [song1, song2, song3, song4, song5], currentSongIndex: -1 };
    let playlistCopy: Playlist = { name: 'jazz', songs: [song1, song2, song3, song4, song5], currentSongIndex: -1 };
  
    test('should set currentSongIndex to 0', () => {
        playPlaylist(playlist);
        expect(playlist.currentSongIndex).toEqual(0);
    });
  
    test('should keep all songs unchanged', () => {
        playPlaylist(playlist);
        expect(playlist.songs).toEqual(playlistCopy.songs);
        expect(playlist.name).toEqual(playlistCopy.name);
    });
});

describe('Play Next Song', () => {
    const song1: Song = { title: 'Money', artist: 'Pink Floyd', album: 'Dark side of the moon', collaborators: [] };
    const song2: Song = { title: 'Giant Steps', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song3: Song = { title: 'Naima', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song4: Song = { title: "In 'N Out", artist: 'Joe Henderson', album: "In 'N Out", collaborators: [] };
    const song5: Song = { title: 'So What', artist: 'Miles Davis', album: 'Kind Of Blue', collaborators: ['John Coltrane']};

    let songQueue: Playlist = { name: 'songQueue', songs: [song1], currentSongIndex: -1 };
    let emptySongQueue: Playlist = { name: 'songQueue', songs: [], currentSongIndex: -1 };
  
    let playlists: PlaylistData = { songQueue: songQueue };
    let playlistsWithEmptyQueue: PlaylistData = { songQueue: emptySongQueue };
  
    test('should play the next song if there is a song in the queue', () => {
        let playlistIndex1: Playlist = { name: 'jazz', songs: [song1, song2, song3, song4, song5], currentSongIndex: 1 };
  
        playNextSong(playlistIndex1, playlists);
        expect(playlists.songQueue.songs).toEqual([]);
        expect(playlistIndex1.currentSongIndex).toEqual(1);
    });
  
    test('should play the next song with no song in the queue', () => {
        let playlistIndex2: Playlist = { name: 'jazz', songs: [song1, song2, song3, song4, song5], currentSongIndex: 2 };
  
        playNextSong(playlistIndex2, playlistsWithEmptyQueue);
        expect(playlistIndex2.currentSongIndex).toEqual(3);
    });
  
    test('should play the next song from the last song, should loop around and set currentSongIndex to 0', () => {
        let playlistIndex4: Playlist = { name: 'jazz', songs: [song1, song2, song3, song4, song5], currentSongIndex: 4 };
  
        playNextSong(playlistIndex4, playlistsWithEmptyQueue);
        expect(playlistIndex4.currentSongIndex).toEqual(0);
    });
  
    test('should not change the current song index on an empty playlist', () => {
        let emptyPlaylist: Playlist = { name: 'jazz', songs: [], currentSongIndex: -1 };
  
        playNextSong(emptyPlaylist, playlistsWithEmptyQueue);
        expect(emptyPlaylist.currentSongIndex).toEqual(-1);
    });
});

describe('Shuffle Song', () => {
    test('should keep currentSongIndex the same if shuffle is called with an empty playlist', () => {
        let playlistIndex1: Playlist = { name: 'jazz', songs: [], currentSongIndex: 1 };
        shuffleSong(playlistIndex1);
        expect(playlistIndex1.currentSongIndex).toEqual(1);
    });
});

describe('Play Previous Song', () => {
    const song1: Song = { title: 'Money', artist: 'Pink Floyd', album: 'Dark side of the moon', collaborators: [] };
    const song2: Song = { title: 'Giant Steps', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song3: Song = { title: 'Naima', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song4: Song = { title: "In 'N Out", artist: 'Joe Henderson', album: "In 'N Out", collaborators: [] };
    const song5: Song = { title: 'So What', artist: 'Miles Davis', album: 'Kind Of Blue', collaborators: ['John Coltrane']};
  
    test('should play the previous song from the first song, should loop around and set currentSongIndex to 4', () => {
        let playlistIndex0: Playlist = { name: 'jazz', songs: [song1, song2, song3, song4, song5], currentSongIndex: 0 };
  
        playPreviousSong(playlistIndex0);
        expect(playlistIndex0.currentSongIndex).toEqual(4);
    });
  
    test('should not change the current song index on an empty playlist', () => {
        let emptyPlaylist: Playlist = { name: 'jazz', songs: [], currentSongIndex: -1 };
  
        playPreviousSong(emptyPlaylist);
        expect(emptyPlaylist.currentSongIndex).toEqual(-1);
    });
});

describe('Add Song Helper', () => {
    const song1: Song = { title: 'Money', artist: 'Pink Floyd', album: 'Dark side of the moon', collaborators: [] };
    const song2: Song = { title: 'Giant Steps', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song3: Song = { title: 'Naima', artist: 'John Coltrane', album: 'Giant Steps', collaborators: [] };
    const song4: Song = { title: "In 'N Out", artist: 'Joe Henderson', album: "In 'N Out", collaborators: [] };
    const song5: Song = { title: 'So What', artist: 'Miles Davis', album: 'Kind Of Blue', collaborators: ['John Coltrane']};

    test('should add song2 to an empty playlist', () => {
        let emptyPlaylist: Playlist = { name: 'jazz', songs: [], currentSongIndex: -1 };
        let matchingSongs: Array<Song> = [song1, song2, song3, song4, song5];
        addSongHelper(emptyPlaylist, matchingSongs, 2);
        expect(emptyPlaylist.songs).toEqual([song2]);
    });
  
    test('should add a song to the end of a playlist with songs', () => {
        let playlistWithSongs: Playlist = { name: 'jazz', songs: [song1, song2, song3], currentSongIndex: -1 };
        let matchingSongs: Array<Song> = [song4, song5];
        addSongHelper(playlistWithSongs, matchingSongs, 1);
        expect(playlistWithSongs.songs).toEqual([song1, song2, song3, song4]);
    });
});