import { Queue, empty as emptyQueue, is_empty as is_empty_queue, dequeue, head as qhead } from './lib/queue_array';
import {type List} from './lib/list';
import { type Stack, push} from './lib/stack';
import * as PromptSync from "prompt-sync";
import * as readline from 'readline';
import * as fs from 'fs';

/**
 * Stores information about a song including title, artist, and album if any.
 */
type Song = {
    title: string;
    artist: string;
    album: string;
    collaborators: List<string>
  };

/**
 * Stores songs, history for navigating backward and forward, the queue for
 * queuing songs, and the index of the currently playing song.
 */
type Playlist =  { 
    name: string;
    songs: Array<Song>;
    currentSongIndex: number; 
  }

const rl: readline.Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mainMenu(): void {
    console.log("[1] Choose Playlist");
    console.log("[2] Make Playlist");
    rl.question("Enter your choice: ", (answer: string): void => {
        if (answer === '1') {
            choosePlaylistMenu();
        } else if (answer === '2') {
            makePlaylistMenu();
        } else {
            console.log("Invalid choice. Please enter 1 or 2.");
            mainMenu();
        }
    });
}

interface PlaylistData {
    [key: string]: {
        [key: string]: Song;
    };
}

// Läs in spellistor från JSON-fil
function loadPlaylists(): PlaylistData {
    try {
        const data = fs.readFileSync('playlists.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading playlists:', error);
        return {};
    }
}

// Skriv ut spellistor och deras index
function printPlaylists(playlists: PlaylistData): void {
    console.log("Choose a playlist:");
    let index = 1;
    for (const playlistName in playlists) {
        console.log(`[${index}] ${playlistName}`);
        index++;
    }
}

// Skriv ut låtarna i en spellista med deras index
function printSongs(playlistName: string, playlist: { [key: string]: Song }): void {
    console.log(`Songs in ${playlistName}:`);
    for (const songIndex in playlist) {
        const song = playlist[songIndex];
        console.log(`[${songIndex}] ${song.title} - ${song.artist}`);
    }
}

// Funktion för att välja en spellista och skriva ut dess låtar
function choosePlaylistMenu(): void {
    const playlists: PlaylistData = loadPlaylists();
    printPlaylists(playlists);

    rl.question("Enter the index of the playlist you want to choose: ", (answer: string): void => {
        const index = parseInt(answer);
        if (!isNaN(index) && index > 0 && index <= Object.keys(playlists).length) {
            const playlistNames = Object.keys(playlists);
            const selectedPlaylistName = playlistNames[index - 1];
            const selectedPlaylist = playlists[selectedPlaylistName];
            printSongs(selectedPlaylistName, selectedPlaylist);
        } else {
            console.log("Invalid playlist index. Please try again.");
            choosePlaylistMenu();
        }
    });
}

function makePlaylistMenu(): void {
    console.log("Make a new playlist");
    rl.question("Give the playlist a name: ", (name: string): void => {
        console.log("Playlist name: " + name);
        // Handle creating playlist here
        rl.close();
    });
}

mainMenu();
