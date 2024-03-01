import { Playlist, SongDatabase, Song, rl } from "../types and constants";
import { printSongsIndex, findMatchingSongs, printSongs } from "./helperFunctions";
import { playlistMenu } from "../menu";

export function viewQueue(selectedPlaylist: Playlist, songQueue: Playlist): void {
    if (songQueue.songs.length > 0) {
        printSongsIndex(songQueue.songs);
    } else {
        console.log("There are no queued songs.")
    }
    playlistMenu(selectedPlaylist);
}

function addSongHelper(selectedPlaylist: Playlist, matchingSongs: Song[], returnPlaylist: Playlist): void {
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

export function addSong(selectedPlaylist: Playlist, songDatabase: SongDatabase, returnPlaylist: Playlist): void {
    
    // initiate empty array of matching songs
    const matchingSongs: Song[] = [];
    
    // add all matching songs into the matchingSongs array
    findMatchingSongs(songDatabase, (selectedSongs: Song[]) => {
        matchingSongs.push(...selectedSongs);
        console.log("Matching songs:");
        printSongsIndex(matchingSongs);
        addSongHelper(selectedPlaylist, matchingSongs, returnPlaylist);
    });
}

export function removeSongHelper(selectedPlaylist: Playlist): void {
    rl.question("Enter the index of the song you want to remove: ", (answer: string): void => {
        const songIndex = parseInt(answer);
        if (!isNaN(songIndex) && songIndex > 0 && songIndex <= selectedPlaylist.songs.length) {
            selectedPlaylist.songs.splice(songIndex - 1, 1); // Adjust index by 1 and remove 1 element
            if (selectedPlaylist.currentSongIndex >= songIndex) {
                selectedPlaylist.currentSongIndex = Math.max(selectedPlaylist.currentSongIndex - 1, 0);
            }
            playlistMenu(selectedPlaylist);
        } else {
            console.log("Invalid choice.")
            removeSongHelper(selectedPlaylist);
        }
    });
}


export function removeSong(selectedPlaylist: Playlist): void {
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
        playlistMenu(selectedPlaylist);
    } else {
        console.log(`Songs in playlist "${selectedPlaylist.name}":`);
        printSongsIndex(selectedPlaylist.songs);
        removeSongHelper(selectedPlaylist);
    }
}