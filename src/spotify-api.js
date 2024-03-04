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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importPlaylist = void 0;
var axios_1 = require("axios");
var types_and_constants_1 = require("./types and constants");
var menu_1 = require("./menu");
// Set your Spotify API credentials
var clientId = 'b878d0f2353a473d90be7c966a105d09';
var clientSecret = '923899eb95e743ebba6a2f073d259a36';
// Set up the Spotify client credentials
var getToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var authBuffer, authHeaders, authData, response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                authBuffer = Buffer.from("".concat(clientId, ":").concat(clientSecret)).toString('base64');
                authHeaders = {
                    headers: {
                        Authorization: "Basic ".concat(authBuffer),
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                };
                authData = 'grant_type=client_credentials';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post('https://accounts.spotify.com/api/token', authData, authHeaders)];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data.access_token];
            case 3:
                error_1 = _a.sent();
                console.log('Error fetching access token:', error_1);
                throw error_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
var getPlaylistInfo = function (accessToken, playlistUri) { return __awaiter(void 0, void 0, void 0, function () {
    var playlistId, playlistResponse, playlistInfo, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                playlistId = (_a = playlistUri.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('?')[0];
                return [4 /*yield*/, axios_1.default.get("https://api.spotify.com/v1/playlists/".concat(playlistId), {
                        headers: {
                            Authorization: "Bearer ".concat(accessToken),
                        },
                    })];
            case 1:
                playlistResponse = _b.sent();
                playlistInfo = {
                    name: playlistResponse.data.name,
                    collaborators: playlistResponse.data.collaborative,
                };
                return [2 /*return*/, playlistInfo];
            case 2:
                error_2 = _b.sent();
                console.error('Error fetching playlist info:', error_2);
                throw error_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
var getPlaylistTracks = function (accessToken, playlistUri) { return __awaiter(void 0, void 0, void 0, function () {
    var playlistId, playlistResponse, tracks, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                playlistId = (_a = playlistUri.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('?')[0];
                return [4 /*yield*/, axios_1.default.get("https://api.spotify.com/v1/playlists/".concat(playlistId, "/tracks"), {
                        headers: {
                            Authorization: "Bearer ".concat(accessToken),
                        },
                    })];
            case 1:
                playlistResponse = _b.sent();
                tracks = playlistResponse.data.items;
                if (!Array.isArray(tracks)) {
                    console.error('Invalid response format. Expected an array of tracks.');
                    console.log('Response:', playlistResponse.data);
                    return [2 /*return*/, []];
                }
                return [2 /*return*/, tracks];
            case 2:
                error_3 = _b.sent();
                console.error('Error fetching playlist tracks:', error_3);
                throw error_3;
            case 3: return [2 /*return*/];
        }
    });
}); };
var extractFeaturedArtists = function (track) {
    var featuredArtists = track.track.artists.slice(1).map(function (artist) { return artist.name; });
    return featuredArtists;
};
function addTrackToSongDb(trackName, artistName, albumName, featuredArtists, songDatabase) {
    // Array dit alla collaborators
    var allFeaturedArtists = [];
    if (Array.isArray(featuredArtists) && featuredArtists.length > 0) {
        allFeaturedArtists.push.apply(allFeaturedArtists, featuredArtists);
    }
    var song = {
        title: trackName,
        artist: artistName,
        album: albumName,
        collaborators: allFeaturedArtists
    };
    songDatabase.songs.push(song);
}
function addTrackToPlaylist(playlistName, trackName, artistName, albumName, featuredArtists, playlists) {
    // Array for all collaborators
    var allFeaturedArtists = [];
    if (Array.isArray(featuredArtists) && featuredArtists.length > 0) {
        allFeaturedArtists.push.apply(allFeaturedArtists, featuredArtists);
    }
    var song = {
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
var updateSongsDbAndPlaylistsDb = function (tracks, playlistName, playlists, songDatabase) {
    if (!Array.isArray(tracks)) {
        console.error('Invalid response format. Expected an array of tracks.');
        return;
    }
    if (tracks.length === 0) {
        console.log('No tracks found in the playlist.');
        return;
    }
    tracks.forEach(function (track) {
        var trackName = track.track.name;
        var artistName = track.track.artists[0].name;
        var albumName = track.track.album.name;
        var featuredArtists = extractFeaturedArtists(track);
        addTrackToSongDb(trackName, artistName, albumName, featuredArtists, songDatabase);
        // Replace 'your_playlist_name' with the desired playlist name
        addTrackToPlaylist(playlistName, trackName, artistName, albumName, featuredArtists, playlists);
    });
};
function extractPlaylistURI(url) {
    // Split the URL by '/'
    var urlParts = url.split('/');
    // Get the last part of the URL (playlist URI)
    var playlistURI = urlParts[urlParts.length - 1];
    // Remove any query parameters (if present)
    var cleanPlaylistURI = playlistURI.split('?')[0];
    return cleanPlaylistURI;
}
var importPlaylist = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        types_and_constants_1.rl.question("Enter the URL to a Spotify playlist: ", function (url) { return __awaiter(void 0, void 0, void 0, function () {
            var playlistUri, accessToken, playlistInfo, playlistName, playlistTracks, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, 5, 6]);
                        playlistUri = extractPlaylistURI(url);
                        return [4 /*yield*/, getToken()];
                    case 1:
                        accessToken = _a.sent();
                        return [4 /*yield*/, getPlaylistInfo(accessToken, playlistUri)];
                    case 2:
                        playlistInfo = _a.sent();
                        playlistName = playlistInfo.name;
                        return [4 /*yield*/, getPlaylistTracks(accessToken, playlistUri)];
                    case 3:
                        playlistTracks = _a.sent();
                        updateSongsDbAndPlaylistsDb(playlistTracks, playlistName, types_and_constants_1.playlists, types_and_constants_1.songData);
                        return [3 /*break*/, 6];
                    case 4:
                        error_4 = _a.sent();
                        console.log('An error occurred:', error_4);
                        (0, menu_1.mainMenu)();
                        return [3 /*break*/, 6];
                    case 5:
                        (0, menu_1.mainMenu)();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.importPlaylist = importPlaylist;
