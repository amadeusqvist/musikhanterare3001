import { Playlist, SongDatabase, Song, rl } from "../types and constants";
import { printSongsIndex, findMatchingSongs, printSongs } from "./helperFunctions";
import { playlistMenu } from "../menu";

/**
 * Displays the queued songs in the song queue and returns to the playlist menu.
 * @param selectedPlaylist - The selected playlist.
 * @param songQueue - The song queue.
 * @returns Void.
 */
export function viewQueue(selectedPlaylist: Playlist, songQueue: Playlist): void {
    if (songQueue.songs.length > 0) {
        printSongsIndex(songQueue.songs);
    } else {
        console.log("There are no queued songs.")
    }
    playlistMenu(selectedPlaylist);
}

/**
 * Helper function for adding a song to the playlist after the user selects a song from the matching songs.
 * @param selectedPlaylist - The selected playlist.
 * @param matchingSongs - Array of songs matching the search criteria.
 * @param returnPlaylist - The playlist to return to after adding the song.
 * @returns Void.
 */
function addSongHelper(selectedPlaylist: Playlist, matchingSongs: Array<Song>, returnPlaylist: Playlist): void {
    rl.question("Enter the number of the song you wish to add: ", (answer: string): void => {
        const songNumber = parseInt(answer);
        if (!isNaN(songNumber) && songNumber > 0 && songNumber <= matchingSongs.length) {
            const selectedSong = matchingSongs[songNumber - 1]
            selectedPlaylist.songs.push(selectedSong);
            console.log(`Added song: ${selectedSong.title} - ${selectedSong.artist} to ${selectedPlaylist.name}`)
            playlistMenu(returnPlaylist);
        } else {
            console.log("Invalid choice.")
            addSongHelper(selectedPlaylist, matchingSongs, returnPlaylist);
        }
    });
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
        console.log("Matching songs:");
        printSongsIndex(matchingSongs);
        addSongHelper(selectedPlaylist, matchingSongs, returnPlaylist);
    });
}

/**
 * Helper function for removing a song from the playlist after the user selects a song to remove.
 * @param selectedPlaylist - The selected playlist.
 * @returns Void.
 */
export function removeSongHelper(selectedPlaylist: Playlist, songIndex: number): void {
    if (!isNaN(songIndex) && songIndex > 0 && songIndex <= selectedPlaylist.songs.length) {
        selectedPlaylist.songs.splice(songIndex - 1, 1); 
        if (selectedPlaylist.currentSongIndex >= songIndex) {
            selectedPlaylist.currentSongIndex = Math.max(selectedPlaylist.currentSongIndex - 1, 0);
        }
    } else {
        console.log("Invalid choice.")
        removeSongHelper(selectedPlaylist, songIndex);
    }
}

function removeSongHelperCallback(selectedPlaylist: Playlist, songIndex: number): void {
    removeSongHelper(selectedPlaylist, songIndex);
    playlistMenu(selectedPlaylist)
}

/**
 * Prompts the user to select a song to remove from the playlist and removes the selected song.
 * @param selectedPlaylist - The selected playlist.
 * @returns Void.
 */
export function removeSong(selectedPlaylist: Playlist): void {
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
        playlistMenu(selectedPlaylist);
    } else {
        console.log(`Songs in playlist ${selectedPlaylist.name}:`);
        printSongsIndex(selectedPlaylist.songs);
        rl.question("Enter the index of the song you want to remove: ", (answer: string): void => {
            const songIndex = parseInt(answer);
            removeSongHelperCallback(selectedPlaylist, songIndex);
        });
    }
}