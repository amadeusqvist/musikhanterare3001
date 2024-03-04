import {searchSongDatabase} from './controllers/helperFunctions'
import {type Song, type SongDatabase} from './types and constants'

describe('search song database', () => {
    const song1: Song = { title: "Money", artist: "Pink Floyd", album: "Dark side of the moon", collaborators: [] };
    const song2: Song = { title: "Giant Steps", artist: "John Coltrane", album: "Giant Steps", collaborators: [] };
    const song3: Song = { title: "Naima", artist: "John Coltrane", album: "Giant Steps", collaborators: [] };
    const song4: Song = { title: "In 'N Out", artist: "Joe Henderson", album: "In 'N Out", collaborators: [] };
    const song5: Song = { title: "So What", artist: "Miles Davis", album: "Kind Of Blue", collaborators: ["John Coltrane", "Cannonball Adderley", "Bill Evans"] };

    const songdatabase: SongDatabase = {songs: [song1, song2, song3, song4, song5]};
    const emptySongDatabase: SongDatabase = {songs: []};
    
    test('search after pink floyd in songdatabase', () => {
        const result = searchSongDatabase(songdatabase, "pink floyd")
        expect(result).toEqual([song1])
    });

    test('search after pink floyd in empty database', () => {
        const result = searchSongDatabase(emptySongDatabase, "pink floyd")
        expect(result).toEqual([])
    });

    test('search after coltrane in songdatabase, should also handle song 5 since coltrane is a collaborator', () => {
        const result = searchSongDatabase(songdatabase, "coltrane")
        expect(result).toEqual([song2, song3, song5])
    });

    test('search after song title naima in songdatabase', () => {
        const result = searchSongDatabase(songdatabase, "naima")
        expect(result).toEqual([song3])
    });

    test('search after nothing empty string in songdatabase', () => {
        const result = searchSongDatabase(songdatabase, "")
        expect(result).toEqual([])
    });
});

