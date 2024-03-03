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
exports.importPlaylist = void 0;
const axios_1 = __importDefault(require("axios"));
const types_and_constants_1 = require("./types and constants");
const menu_1 = require("./menu");
// Set your Spotify API credentials
const clientId = 'b878d0f2353a473d90be7c966a105d09';
const clientSecret = '923899eb95e743ebba6a2f073d259a36';
// Set up the Spotify client credentials
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
        throw error;
    }
});
const getPlaylistInfo = (accessToken, playlistUri) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Extract the playlist ID from the URI
        const playlistId = (_a = playlistUri.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('?')[0];
        // Retrieve playlist details
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
const getPlaylistTracks = (accessToken, playlistUri) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        // Extract the playlist ID from the URI
        const playlistId = (_b = playlistUri.split('/').pop()) === null || _b === void 0 ? void 0 : _b.split('?')[0];
        // Retrieve tracks from the playlist
        const playlistResponse = yield axios_1.default.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const tracks = playlistResponse.data.items;
        if (!Array.isArray(tracks)) {
            console.error('Invalid response format. Expected an array of tracks.');
            console.log('Response:', playlistResponse.data);
            return [];
        }
        return tracks;
    }
    catch (error) {
        console.error('Error fetching playlist tracks:', error);
        throw error;
    }
});
const extractFeaturedArtists = (track) => {
    const featuredArtists = track.track.artists.slice(1).map((artist) => artist.name);
    return featuredArtists;
};
function addTrackToSongDb(trackName, artistName, albumName, featuredArtists, songDatabase) {
    // Array dit alla collaborators
    const allFeaturedArtists = [];
    if (Array.isArray(featuredArtists) && featuredArtists.length > 0) {
        allFeaturedArtists.push(...featuredArtists);
    }
    const song = {
        title: trackName,
        artist: artistName,
        album: albumName,
        collaborators: allFeaturedArtists
    };
    songDatabase.songs.push(song);
}
function addTrackToPlaylist(playlistName, trackName, artistName, albumName, featuredArtists, playlists) {
    // Array for all collaborators
    const allFeaturedArtists = [];
    if (Array.isArray(featuredArtists) && featuredArtists.length > 0) {
        allFeaturedArtists.push(...featuredArtists);
    }
    const song = {
        title: trackName,
        artist: artistName,
        album: albumName,
        collaborators: allFeaturedArtists,
    };
    // Check if the playlist already exists, create it if not
    if (!playlists[playlistName]) {
        playlists[playlistName] = {
            name: playlistName,
            songs: [],
            currentSongIndex: 0,
        };
    }
    // Add the song to the playlist
    playlists[playlistName].songs.push(song);
}
const updateSongsDbAndPlaylistsDb = (tracks, playlistName, playlists, songDatabase) => {
    if (!Array.isArray(tracks)) {
        console.error('Invalid response format. Expected an array of tracks.');
        return;
    }
    if (tracks.length === 0) {
        console.log('No tracks found in the playlist.');
        return;
    }
    tracks.forEach((track) => {
        const trackName = track.track.name;
        const artistName = track.track.artists[0].name;
        const albumName = track.track.album.name;
        const featuredArtists = extractFeaturedArtists(track);
        addTrackToSongDb(trackName, artistName, albumName, featuredArtists, songDatabase);
        // Replace 'your_playlist_name' with the desired playlist name
        addTrackToPlaylist(playlistName, trackName, artistName, albumName, featuredArtists, playlists);
    });
};
function extractPlaylistURI(url) {
    // Split the URL by '/'
    const urlParts = url.split('/');
    // Get the last part of the URL (playlist URI)
    const playlistURI = urlParts[urlParts.length - 1];
    // Remove any query parameters (if present)
    const cleanPlaylistURI = playlistURI.split('?')[0];
    return cleanPlaylistURI;
}
const importPlaylist = () => __awaiter(void 0, void 0, void 0, function* () {
    types_and_constants_1.rl.question("Enter the URL to a Spotify playlist: ", (url) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const playlistUri = extractPlaylistURI(url);
            // Get access token
            const accessToken = yield getToken();
            // Print playlist name
            const playlistInfo = yield getPlaylistInfo(accessToken, playlistUri);
            const playlistName = playlistInfo.name;
            // Get and print the tracks from the playlist
            const playlistTracks = yield getPlaylistTracks(accessToken, playlistUri);
            updateSongsDbAndPlaylistsDb(playlistTracks, playlistName, types_and_constants_1.playlists, types_and_constants_1.songData);
        }
        catch (error) {
            console.log('An error occurred:', error);
            (0, menu_1.mainMenu)();
        }
        finally {
            (0, menu_1.mainMenu)();
        }
    }));
});
exports.importPlaylist = importPlaylist;
