"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helperFunctions_1 = require("./controllers/helperFunctions");
describe('search song database', () => {
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
