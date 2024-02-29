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
	collaborators: Array<string>; 
};

type SongDatabase = {
    songs: Array<Song>;
};

function loadSongs(): SongDatabase {
    try {
        const data = fs.readFileSync('songs.json', 'utf8');
        return JSON.parse(data) as SongDatabase;
    } catch (error) {
        console.error('Error loading songs:', error);
        return { songs: [] };
    }
}

type Playlist = {
	name: string;
	songs: Array<Song>;
    currentSongIndex: number
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

/**
 * Displays the menu for choosing a playlist and prompts the user to select a playlist.
 * Prints the list of playlists and allows the user to choose a playlist by index.
 * @param playlists - The object containing all the playlists.
 * @returns Void.
 */
function choosePlaylistMenu(playlists: PlaylistData): void {
    printPlaylists(playlists);

    rl.question("Enter the index of the playlist you want to choose: ", (answer: string): void => {
        const index = parseInt(answer);
        if (!isNaN(index) && index > 0 && index <= Object.keys(playlists).length) {
            const playlistNames = Object.keys(playlists);
            const selectedPlaylistKey = playlistNames[index - 1];
            const selectedPlaylist = playlists[selectedPlaylistKey];
            console.log(`Songs in playlist "${selectedPlaylist.name}":`);
            printSongs(selectedPlaylist.songs);
            playlistMenu(selectedPlaylist);

        } else {
            console.log("Invalid playlist index. Please try again.");
            choosePlaylistMenu(playlists);
        }
    });
}

/**
 * Prints the list of songs in a playlist along with their titles and artists.
 * @param playlistName - The name of the playlist.
 * @param songs - The array of songs in the playlist.
 * @returns Void.
 */
function printSongs(songArray: Song[]): void {
    for (let i = 0; i < songArray.length; i++) {
        console.log(`${songArray[i].title} - ${songArray[i].artist}`);
    }
}

//The same as printSongs but also adds an index to each song.
function printSongsIndex(songArray: Song[]): void {
    for (let i = 0; i < songArray.length; i++) {
        console.log(`[${i + 1}] ${songArray[i].title} - ${songArray[i].artist}`);
    }
}

/**
 * Prints the list of playlists along with their names.
 * @param playlists - The object containing all the playlists.
 * @returns Void.
 */
function printPlaylists(playlists: PlaylistData): void {
    console.log("Available playlists:");
    Object.keys(playlists).forEach((playlistName, index) => {
        console.log(`[${index + 1}] ${playlistName}`);
    });
}

function playlistMenu(selectedPlaylist: Playlist): void {
    console.log("[1] Play");
    console.log("[2] Play specific song");
    console.log("[3] Play next song");
    console.log("[4] Play previous song");
    console.log("[5] Sort by song (A-Z)");
    console.log("[6] Sort by artist (A-Z)");
    console.log("[7] Add song to playlist");
    console.log("[8] Remove song from playlist");
    console.log("[9] Queue song");
    console.log("[10] View queued songs");
    console.log("[11] Shuffle");

    rl.question("Enter your choice: ", (answer: string): void => {
        if (answer === '1') {
            playPlaylist(selectedPlaylist);
        } else if (answer === '2') {
            playSpecificSong(selectedPlaylist);
        } else if (answer === '3') {
            //playNextSong
        } else if (answer === '4') {
            playPreviousSong(selectedPlaylist);
        } else if (answer === '11') {
            shuffleSong(selectedPlaylist);
        } else if (answer === '8') {
            removeSong(selectedPlaylist);
        } else {
            console.log("Invalid choice. Please enter 1 or 2.");
            playlistMenu(selectedPlaylist); // Prompt again if choice is invalid
        }
    });
}

/**
 * Plays the first song in the playlist and prompts the user to navigate to the next song or return to the playlist menu.
 * @param selectedPlaylistName - The name of the selected playlist.
 * @param songs - The array of songs in the playlist.
 * @returns Void.
 */
function playPlaylist(selectedPlaylist: Playlist): void {
    console.log(`Now playing playlist: ${selectedPlaylist.name}`);
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
    } else {
        const currentSong = selectedPlaylist.songs[0];
        console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
        selectedPlaylist.currentSongIndex = 0;
    }
	playlistMenu(selectedPlaylist);
}

/**
 * Plays the specific song chosen by the user from the playlist and prompts the user to navigate to the next song or return to the playlist menu.
 * @param selectedPlaylistName - The name of the selected playlist.
 * @param songs - The array of songs in the playlist.
 * @returns Void.
 */
function playSpecificSong(selectedPlaylist: Playlist): void {
    console.log(`Playlist: ${selectedPlaylist.name}`);
    for (let i = 0; i < selectedPlaylist.songs.length; i++) {
        console.log(`[${i + 1}]. ${selectedPlaylist.songs[i].title} - ${selectedPlaylist.songs[i].artist}`);
    }

    rl.question("Enter the number of the song you wish to play: ", (answer: string): void => {
        const songIndex = parseInt(answer);
        if (!isNaN(songIndex) && songIndex > 0 && songIndex <= selectedPlaylist.songs.length) {
            const currentSong = selectedPlaylist.songs[songIndex - 1];
            console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
            selectedPlaylist.currentSongIndex = songIndex - 1;
			playlistMenu(selectedPlaylist);
        } else {
            console.log("Invalid song number. Please try again.");
            playSpecificSong(selectedPlaylist); // Prompt again if input is invalid
        }
    });
}

/**
 * Plays the previous song in the playlist.
 * @param selectedPlaylist - The selected playlist.
 * @returns Void.
 */
function playPreviousSong(selectedPlaylist: Playlist): void {
    if (selectedPlaylist.currentSongIndex === -1) {
        console.log("No song currently playing.");
    } else if (selectedPlaylist.currentSongIndex === 0) {
        const currentIndex = selectedPlaylist.songs.length - 1;
        const currentSong = selectedPlaylist.songs[currentIndex];
        console.log(`Now playing ${currentSong.title} - ${currentSong.artist}`);
        selectedPlaylist.currentSongIndex = currentIndex;
    } else {
        const currentIndex = selectedPlaylist.currentSongIndex;
        const previousSong = selectedPlaylist.songs[currentIndex - 1];
        console.log(`Now playing: ${previousSong.title} - ${previousSong.artist}`);
        selectedPlaylist.currentSongIndex = currentIndex;
    }
	playlistMenu(selectedPlaylist);
}

/**
Searches the database for songs.
@param database - The songdatabase.
@param searchTerm - The searchterm may be the title or the artist
@returns An array of songs matching the search criteria.
*/
function searchSongDatabase(songDatabase: SongDatabase, searchTerm: string): Array<Song> {
    const matchingSongs: Song[] = [];
    const lowercaseSearchTerm = searchTerm.toLowerCase();

    for (const songId in songDatabase.songs) {
        const song = songDatabase.songs[songId];
        const lowercaseTitle = song.title.toLowerCase();
        const lowercaseArtist = song.artist.toLowerCase();

        if (
            lowercaseTitle.includes(lowercaseSearchTerm, undefined) ||
            lowercaseArtist.includes(lowercaseSearchTerm) ||
            song.collaborators.some(collaborator =>
                collaborator.toLowerCase().includes(lowercaseSearchTerm)
            )
        ) {
            matchingSongs.push(song);
        }
    }

    return matchingSongs;
}

function findMatchingSongs(songDatabase: SongDatabase, callback: (matchingSongs: Song[]) => void): void {
    const askQuestion = () => {
        rl.question("Search after a song: ", (answer: string): void => {
            const searchTerm = answer;
            const matchingSongs = searchSongDatabase(songDatabase, searchTerm);

            if (matchingSongs.length === 0) {
                console.log("There were no matching songs. Please try again.");
                // Recursively call the function to allow the user to try again
                askQuestion();
            } else {
                // Callback with matchingSongs array
                callback(matchingSongs);
            }
        });
    };
    askQuestion();
}


function addSong(selectedPlaylist: Playlist, songDatabase: SongDatabase): void {
    
    // initiate empty array of matching songs
    const matchingSongs: Song[] = [];
    
    // add all matching songs into the matchingSongs array
    findMatchingSongs(songDatabase, (selectedSongs: Song[]) => {
        matchingSongs.push(...selectedSongs);
    });

    // print all the songs Index
    console.log("Matching songs:");
    printSongsIndex(matchingSongs);

    rl.question("Enter the number of the song you wish to play: ", (answer: string): void => {
        const songNumber = parseInt(answer);
        if (!isNaN(songNumber) && songNumber > 0 && songNumber <= matchingSongs.length) {
            const selectedSong = matchingSongs[songNumber - 1]
            selectedPlaylist.songs.push(selectedSong);
        } else {
            // if invalid input print options again
        }
    });
}

function removeSong(selectedPlaylist: Playlist): void {
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
    } else {
        console.log(`Songs in playlist "${selectedPlaylist.name}":`);
        printSongs(selectedPlaylist.songs);
        rl.question("Enter the index of the song you want to remove: ", (answer: string): void => {
            const songIndex = parseInt(answer);
            if (!isNaN(songIndex) && songIndex > 0 && songIndex <= Object.keys(selectedPlaylist).length) {
                selectedPlaylist.songs = selectedPlaylist.songs.slice(0, songIndex), selectedPlaylist.songs.slice(songIndex + 1)
                if (selectedPlaylist.currentSongIndex < songIndex) {
                    selectedPlaylist.currentSongIndex = selectedPlaylist.currentSongIndex - 1;
                }

            }
        });
    }
}

function shuffleSong(selectedPlaylist: Playlist): void {
    console.log(`Now playing playlist: ${selectedPlaylist}`);
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
    } else {
        const songs = selectedPlaylist.songs;
        const random_index = Math.floor(Math.random() * songs.length);
        const currentSong = songs.splice(random_index, 1)[0];
        console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
    }
    playlistMenu(selectedPlaylist);
}

/**
 * Plays the next song in the playlist.
 * @param playlist - The playlist.
 *
function playNextSong(playlist: Playlist, songQueue: SongQueue): Playlist {
    if (is_empty_queue(songQueue)) {
        const currentIndex = playlist.currentSongIndex;
        if (playlist.songs[currentIndex] === playlist.songs[-1]) {
            const currentIndex = 0;
            const currentSong = playlist.songs[currentIndex];

            console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');

            return {...playlist, currentSongIndex: currentIndex};
        } else {
			const currentSong = playlist.songs[currentIndex + 1];
            console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');

            return {...playlist, currentSongIndex: currentIndex + 1};
        }

    
    } else {
		const currentSong = qhead(songQueue);
        dequeue(songQueue);
        console.log('Now playing: ${currentSong.title} - ${currentSong.artist}');
        return playlist;
    }
}
*/

function makePlaylistMenu(): void {
    console.log("Make a new playlist");
    rl.question("Give the playlist a name: ", (name: string): void => {
        console.log("Playlist name: " + name);
        // Handle creating playlist here
        rl.close();
    });
}

mainMenu();
