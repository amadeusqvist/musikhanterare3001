"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rl = exports.songQueue = exports.songData = exports.playlists = void 0;
var helperFunctions_1 = require("./controllers/helperFunctions");
var readline = require("readline");
exports.playlists = (0, helperFunctions_1.loadPlaylists)();
exports.songData = (0, helperFunctions_1.loadSongs)();
exports.songQueue = exports.playlists["songQueue"];
exports.rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
