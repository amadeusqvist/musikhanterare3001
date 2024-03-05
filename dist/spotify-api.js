"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importPlaylist = exports.updateSongsDbAndPlaylistsDb = exports.addTrackToPlaylist = exports.addTrackToSongDb = exports.createSong = void 0;
const axios_1 = __importDefault(require("axios"));
const types_and_constants_1 = require("./types and constants");
const menu_1 = require("./menu");
//Spotify API client credentials
const clientId = 'b878d0f2353a473d90be7c966a105d09';
const clientSecret = '923899eb95e743ebba6a2f073d259a36';
/**
 * Fetches the Spotify access token using client credentials and returns it.
 * @returns Promise<string> - A promise that resolves to the access token.
 */
const getToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const authBuffer = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const authHeaders = {
        headers: {
            Authorization: `Basic ${authBuffer}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    const authData = 'grant_type=client_credentials';
    try {
        const response = yield axios_1.default.post('https://accounts.spotify.com/api/token', authData, authHeaders);
        return response.data.access_token;
    }
    catch (error) {
        console.log('Error fetching access token:', error);
        console.log();
        throw error;
    }
});
/**
 * Retrieves information about a Spotify playlist using the provided access token and playlist URI.
 * @param accessToken - The Spotify access token.
 * @param playlistUri - The URI of the Spotify playlist.
 * @returns Promise<{ name: string, collaborators: boolean }> - A promise that resolves to an object containing playlist information.
 */
const getPlaylistInfo = (accessToken, playlistUri) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const playlistId = (_a = playlistUri.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('?')[0];
        const playlistResponse = yield axios_1.default.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const playlistInfo = {
            name: playlistResponse.data.name,
            collaborators: playlistResponse.data.collaborative,
        };
        return playlistInfo;
    }
    catch (error) {
        console.error('Error fetching playlist info:', error);
        throw error;
    }
});
/**
 * Retrieves tracks from a Spotify playlist using the provided access token and playlist URI.
 * @param accessToken - The Spotify access token.
 * @param playlistUri - The URI of the Spotify playlist.
 * @returns Promise<Array<any>> - A promise that resolves to an array of tracks.
 */
const getPlaylistTracks = (accessToken, playlistUri) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const playlistId = (_b = playlistUri.split('/').pop()) === null || _b === void 0 ? void 0 : _b.split('?')[0];
        const playlistResponse = yield axios_1.default.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const tracks = playlistResponse.data.items;
        if (!Array.isArray(tracks)) {
            console.error('Invalid response format. Expected an array of tracks.');
            console.log('Response:', playlistResponse.data);
            console.log();
            return [];
        }
        return tracks;
    }
    catch (error) {
        console.error('Error fetching playlist tracks:', error);
        throw error;
    }
});
/**
 * Extracts featured artists from a track object.
 * @param track - The track object.
 * @returns - An array of featured artists.
 */
const extractFeaturedArtists = (track) => {
    return track.track.artists.slice(1).map((artist) => artist.name);
};
/**
 * Creates a Song object based on track details.
 * @param trackName - The name of the track.
 * @param artistName - The name of the artist.
 * @param albumName - The name of the album.
 * @param featuredArtists - An array of featured artists.
 * @returns - The Song object.
 */
const createSong = (trackName, artistName, albumName, featuredArtists) => {
    return {
        title: trackName,
        artist: artistName,
        album: albumName,
        collaborators: featuredArtists || [],
    };
};
exports.createSong = createSong;
/**
 * Adds a track to the Song Database.
 * @param song - A song.
 * @param songDatabase - The Song Database object.
 * @returns Void.
 */
const addTrackToSongDb = (song, songDatabase) => {
    songDatabase.songs.push(song);
};
exports.addTrackToSongDb = addTrackToSongDb;
/**
 * Adds a track to a playlist in the Playlist Database.
 * @param playlistName - The name of the playlist.
 * @param song - A song.
 * @param playlists - The Playlist Database object.
 * @returns Void.
 */
const addTrackToPlaylist = (playlistName, song, playlists) => {
    if (!playlists[playlistName]) {
        playlists[playlistName] = {
            name: playlistName,
            songs: [],
            currentSongIndex: 0,
        };
    }
    playlists[playlistName].songs.push(song);
};
exports.addTrackToPlaylist = addTrackToPlaylist;
/**
 * Updates the Song Database and Playlist Database with the provided tracks and playlist name.
 * @param tracks - An array of tracks to be added to the databases.
 * @param playlistName - The name of the playlist.
 * @param playlists - The Playlist Database object.
 * @param songDatabase - The Song Database object.
 * @returns Void.
 */
const updateSongsDbAndPlaylistsDb = (tracks, playlistName, playlists, songDatabase) => {
    if (!Array.isArray(tracks)) {
        console.error('Invalid response format. Expected an array of tracks.');
        return;
    }
    if (tracks.length === 0) {
        console.log('No tracks found in the playlist.');
        console.log();
        return;
    }
    tracks.forEach((track) => {
        const trackName = track.track.name;
        const artistName = track.track.artists[0].name;
        const albumName = track.track.album.name;
        const featuredArtists = extractFeaturedArtists(track);
        const song = (0, exports.createSong)(trackName, artistName, albumName, featuredArtists);
        (0, exports.addTrackToSongDb)(song, songDatabase);
        (0, exports.addTrackToPlaylist)(playlistName, song, playlists);
    });
};
exports.updateSongsDbAndPlaylistsDb = updateSongsDbAndPlaylistsDb;
/**
 * Extracts the Spotify playlist URI from a given URL.
 * @param url - The URL of the Spotify playlist.
 * @returns string - The extracted playlist URI.
 */
function extractPlaylistURI(url) {
    const urlParts = url.split('/');
    const playlistURI = urlParts[urlParts.length - 1];
    const cleanPlaylistURI = playlistURI.split('?')[0];
    return cleanPlaylistURI;
}
/**
 * Imports a Spotify playlist by prompting the user to enter the URL and updating the Song Database and Playlist Database.
 * @returns void.
 */
const importPlaylist = () => __awaiter(void 0, void 0, void 0, function* () {
    types_and_constants_1.rl.question("Enter the URL to a Spotify playlist: ", (url) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const playlistUri = extractPlaylistURI(url);
            const accessToken = yield getToken();
            const playlistInfo = yield getPlaylistInfo(accessToken, playlistUri);
            const playlistName = playlistInfo.name;
            const playlistTracks = yield getPlaylistTracks(accessToken, playlistUri);
            (0, exports.updateSongsDbAndPlaylistsDb)(playlistTracks, playlistName, types_and_constants_1.playlists, types_and_constants_1.songData);
        }
        catch (error) {
            console.log('An error occurred:', error);
            console.log();
        }
        finally {
            (0, menu_1.mainMenu)();
        }
    }));
});
exports.importPlaylist = importPlaylist;
