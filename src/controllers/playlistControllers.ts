import { Playlist, SongDatabase, Song, rl } from "../types and constants";
import { printSongsIndex, findMatchingSongs, printSongs, isValidSongIndex } from "./helperFunctions";
import { playlistMenu } from "../menu";
import { match } from "assert";

/**
 * Displays the queued songs in the song queue and returns to the playlist menu.
 * @param selectedPlaylist - The selected playlist.
 * @param songQueue - The song queue.
 * @returns Void.
 */
export function viewQueue(selectedPlaylist: Playlist, songQueue: Playlist): void {
    const { songs } = songQueue;

    if (songs.length > 0) {
        printSongsIndex(songs);
    } else {
        console.log("There are no queued songs.")
        console.log();
    }
}

export function viewQueueCallback(selectedPlaylist: Playlist, songQueue: Playlist): void {
    viewQueue(selectedPlaylist, songQueue);
    playlistMenu(selectedPlaylist);
}

/**
 * Prompts the user to search for a song, displays matching songs, and allows the user to add a selected song to the playlist.
 * @param selectedPlaylist - The selected playlist.
 * @param songDatabase - The Song Database.
 * @param returnPlaylist - The playlist to return to after adding the song.
 * @returns Void.
 */
export function addSong(selectedPlaylist: Playlist, songDatabase: SongDatabase, returnPlaylist: Playlist): void {
    const matchingSongs: Array<Song> = [];

    findMatchingSongs(songDatabase, (selectedSongs: Song[]) => {
        matchingSongs.push(...selectedSongs);

        if (matchingSongs.length === 0) {
            playlistMenu(returnPlaylist);
        }

        console.log("Matching songs:");
        console.log();
        printSongsIndex(matchingSongs);

        rl.question("Enter the number of the song you wish to add: ", (answer: string): void => {
            const songIndex = parseInt(answer);

            if (isValidSongIndex(songIndex, matchingSongs)) {
                addSongCallback(selectedPlaylist, matchingSongs, returnPlaylist, songIndex);
            } else {
                console.log("Invalid song index. Please try again.");
                console.log();
                addSong(selectedPlaylist, songDatabase, returnPlaylist);
            }
        });
    });
}

function addSongCallback(selectedPlaylist: Playlist, matchingSongs: Array<Song>, returnPlaylist: Playlist, songIndex: number): void {
    addSongHelper(selectedPlaylist, matchingSongs, songIndex);
    playlistMenu(returnPlaylist);
}

/**
 * Helper function for adding a song to the playlist after the user selects a song from the matching songs.
 * @param selectedPlaylist - The selected playlist.
 * @param matchingSongs - Array of songs matching the search criteria.
 * @param returnPlaylist - The playlist to return to after adding the song.
 * @returns Void.
 */
export function addSongHelper(selectedPlaylist: Playlist, matchingSongs: Array<Song>, songNumber: number): void {
    const selectedSong = matchingSongs[songNumber - 1];
    selectedPlaylist.songs.push(selectedSong);
    console.log(`Added song: ${selectedSong.title} - ${selectedSong.artist} to ${selectedPlaylist.name}`);
    console.log();
}

/**
 * Prompts the user to select a song to remove from the playlist and removes the selected song.
 * @param selectedPlaylist - The selected playlist.
 * @returns Void.
 */
export function removeSong(selectedPlaylist: Playlist): void {
    const { songs, name } = selectedPlaylist;

    if (songs.length === 0) {
        console.log(`Playlist ${name} is empty.`);
        console.log();
        playlistMenu(selectedPlaylist);
        return;
    }

    console.log(`Songs in playlist ${name}:`);
    console.log();
    printSongsIndex(songs);

    rl.question("Enter the index of the song you want to remove: ", (answer: string): void => {
        const songIndex = parseInt(answer);

        if (isValidSongIndex(songIndex, songs)) {
            removeSongHelperCallback(selectedPlaylist, songIndex);
        } else {
            console.log("Invalid song index. Please try again.");
            console.log();
            removeSong(selectedPlaylist);
        }
    });
}

function removeSongHelperCallback(selectedPlaylist: Playlist, songIndex: number): void {
    removeSongHelper(selectedPlaylist, songIndex);
    playlistMenu(selectedPlaylist)
}

/**
 * Helper function for removing a song from the playlist after the user selects a song to remove.
 * @param selectedPlaylist - The selected playlist.
 * @param songIndex - The index of the song to be removed.
 * @returns Void.
 */
export function removeSongHelper(selectedPlaylist: Playlist, songIndex: number): void {
    const { songs, currentSongIndex } = selectedPlaylist;

    songs.splice(songIndex - 1, 1);

    if (currentSongIndex >= songIndex) {
        selectedPlaylist.currentSongIndex = Math.max(currentSongIndex - 1, 0);
    }
}


