import {rl, playlists, Playlist, PlaylistData, songData, songQueue} from './types and constants'
import { printPlaylists, printSongs } from './controllers/helperFunctions';
import { playPlaylist, playNextSong, playPreviousSong, playSpecificSong, shuffleSong} from './controllers/playControllers';
import { addSong, removeSong, viewQueue } from './controllers/playlistControllers';


export function mainMenu(): void {
    console.log("[1] Choose Playlist");
    console.log("[2] Make Playlist");
    rl.question("Enter your choice: ", (answer: string): void => {
        if (answer === '1') {
            choosePlaylistMenu(playlists);
        } else if (answer === '2') {
            makePlaylistMenu(playlists);
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
export function choosePlaylistMenu(playlists: PlaylistData): void {
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

export function playlistMenu(selectedPlaylist: Playlist): void {
    console.log(`Selected playlist: &{selectedPlaylist.name}`);
    console.log("[1] Play playlist");
    console.log("[2] Play specific song");
    console.log("[3] Play next song");
    console.log("[4] Play previous song");
    console.log("[5] Add song to playlist");
    console.log("[6] Remove song from playlist");
    console.log("[7] Queue song");
    console.log("[8] View queued songs");
    console.log("[9] Shuffle");
    console.log("[10] Change playlist")

    rl.question("Enter your choice: ", (answer: string): void => {
        if (answer === '1') {
            playPlaylist(selectedPlaylist);
        } else if (answer === '2') {
            playSpecificSong(selectedPlaylist);
        } else if (answer === '3') {
            playNextSong(selectedPlaylist, playlists);
        } else if (answer === '4') {
            playPreviousSong(selectedPlaylist);
        } else if (answer === '5') {
            addSong(selectedPlaylist, songData, selectedPlaylist);
        } else if (answer === '6') {
            removeSong(selectedPlaylist);
        } else if (answer === '7') {
            addSong(songQueue, songData, selectedPlaylist);
        } else if (answer === '8') {
            viewQueue(selectedPlaylist, songQueue);
        } else if (answer === '9') {
            shuffleSong(selectedPlaylist);
        } else if (answer === '10') {
            mainMenu();
        } else {
            console.log("Invalid choice. Please enter valid number (1-10).");
            playlistMenu(selectedPlaylist); // Prompt again if choice is invalid
        }
    });
}

export function makePlaylistMenu(playlists: PlaylistData): void {
    rl.question("Give the new playlist a name: ", (playlistName: string): void => {
        if (playlists[playlistName]) {
            console.log("Playlistname already exists");
            makePlaylistMenu(playlists);
        } else {
            const newPlaylist: Playlist = {
                name: playlistName,
                songs: [],
                currentSongIndex: -1
            };
            playlists[playlistName] = newPlaylist;
            playlistMenu(playlists[playlistName]);
        }
    });
}