import { Queue, empty as emptyQueue, is_empty as is_empty_queue, dequeue, head as qhead } from './lib/queue_array';
import {type List} from './lib/list';
import { type Stack, push} from './lib/stack';
import * as PromptSync from "prompt-sync";
import * as readline from 'readline';
import * as fs from 'fs';

type Song = {
	title: string;
	artist: string;
	album: string;
	collaborators: string[]; // Assuming collaborators is an array of strings
};
  
type Playlist = {
	name: string;
	songs: Song[];
};

type PlaylistData = {
	[key: string]: Playlist;
};

// Load playlists from JSON file
function loadPlaylists(): PlaylistData {
	try {
		const data = fs.readFileSync('playlists.json', 'utf8');
		return JSON.parse(data) as PlaylistData;
	} catch (error) {
		console.error('Error loading playlists:', error);
		return {};
	}
}

const playlists: PlaylistData = loadPlaylists();

const rl: readline.Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mainMenu(): void {
    console.log("[1] Choose Playlist");
    console.log("[2] Make Playlist");
    rl.question("Enter your choice: ", (answer: string): void => {
        if (answer === '1') {
            choosePlaylistMenu(playlists);
        } else if (answer === '2') {
            makePlaylistMenu();
        } else {
            console.log("Invalid choice. Please enter 1 or 2.");
            mainMenu();
        }
    });
}

function choosePlaylistMenu(playlists: PlaylistData): void {
    printPlaylists(playlists);

    rl.question("Enter the index of the playlist you want to choose: ", (answer: string): void => {
        const index = parseInt(answer);
        if (!isNaN(index) && index > 0 && index <= Object.keys(playlists).length) {
            const playlistNames = Object.keys(playlists);
            const selectedPlaylistName = playlistNames[index - 1];
            const selectedPlaylist = playlists[selectedPlaylistName];
            printSongs(selectedPlaylistName, selectedPlaylist.songs);
            playlistMenu(selectedPlaylistName, selectedPlaylist.songs); // Pass playlist name and songs as arguments
        } else {
            console.log("Invalid playlist index. Please try again.");
            choosePlaylistMenu(playlists);
        }
    });
}

function printSongs(playlistName: string, songs: Song[]): void {
	console.log(`Songs in playlist "${playlistName}":`);
    for (let i = 0; i < songs.length; i++) {
        console.log(`${songs[i].title} - ${songs[i].artist}`);
    }
}

function printSongsIndex(playlistName: string, songs: Song[]): void {
    console.log(`Songs in playlist "${playlistName}":`);
    for (let i = 0; i < songs.length; i++) {
        console.log(`[${i + 1}] ${songs[i].title} - ${songs[i].artist}`);
    }
}

function printPlaylists(playlists: PlaylistData): void {
    console.log("Available playlists:");
    Object.keys(playlists).forEach((playlistName, index) => {
        console.log(`[${index + 1}] ${playlistName}`);
    });
}

function playlistMenu(selectedPlaylistName: string, songs: Song[]): void {
    console.log("[1] Play");
    console.log("[2] Play specific song");
    rl.question("Enter your choice: ", (answer: string): void => {
        if (answer === '1') {
            playPlaylist(selectedPlaylistName, songs);
        } else if (answer === '2') {
            playSpecificSong(selectedPlaylistName, songs);
        } else {
            console.log("Invalid choice. Please enter 1 or 2.");
            playlistMenu(selectedPlaylistName, songs); // Prompt again if choice is invalid
        }
    });
}

function playPlaylist(selectedPlaylistName: string, songs: Song[]): void {
    console.log(`Now playing playlist: ${selectedPlaylistName}`);
    if (songs.length === 0) {
        console.log("Playlist is empty.");
    } else {
        const currentSong = songs[0];
        console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
    }
	playlistMenu(selectedPlaylistName, songs);
}

function playSpecificSong(selectedPlaylistName: string, songs: Song[]): void {
    console.log(`Playlist: ${selectedPlaylistName}`);
    for (let i = 0; i < songs.length; i++) {
        console.log(`[${i + 1}]. ${songs[i].title} - ${songs[i].artist}`);
    }

    rl.question("Enter the number of the song you wish to play: ", (answer: string): void => {
        const songNumber = parseInt(answer);
        if (!isNaN(songNumber) && songNumber > 0 && songNumber <= songs.length) {
            const currentSong = songs[songNumber - 1];
            console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
			playlistMenu(selectedPlaylistName, songs);
        } else {
            console.log("Invalid song number. Please try again.");
            playSpecificSong(selectedPlaylistName, songs); // Prompt again if input is invalid
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
