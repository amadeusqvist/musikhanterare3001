import { mainMenu, loadPlaylists } from './controllers/playlistController';
import * as readline from 'readline';

const playlists = loadPlaylists();
const songQueue = playlists["songQueue"];
const rl: readline.Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

mainMenu();