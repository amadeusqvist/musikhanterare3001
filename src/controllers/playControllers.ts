import { Playlist, rl, PlaylistData, songQueue } from "../types and constants";
import { playlistMenu } from "../menu";
import { printSongsIndex } from "./helperFunctions";

/**
 * Plays the first song in the playlist and prompts the user to navigate to the next song or return to the playlist menu.
 * @param selectedPlaylist - The selected playlist.
 * @returns Void.
 */
export function playPlaylist(selectedPlaylist: Playlist): void {
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
    } else {
        const currentSong = selectedPlaylist.songs[0];
        console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
        selectedPlaylist.currentSongIndex = 0;
    }
}

export function playPlaylistCallback(selectedPlaylist: Playlist): void {
    playPlaylist(selectedPlaylist);
    playlistMenu(selectedPlaylist);
}

/**
 * Plays the specific song chosen by the user from the playlist and prompts the user to navigate to the next song or return to the playlist menu.
 * @param selectedPlaylist - The selected playlist.
 * @returns Void.
 */
export function playSpecificSong(selectedPlaylist: Playlist): void {
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
        playlistMenu(selectedPlaylist);    
    }
    printSongsIndex(selectedPlaylist.songs);

    rl.question("Enter the number of the song you wish to play: ", (answer: string): void => {
        const songIndex = parseInt(answer);
        if (!isNaN(songIndex) && songIndex > 0 && songIndex <= selectedPlaylist.songs.length) {
            const currentSong = selectedPlaylist.songs[songIndex - 1];
            console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
            selectedPlaylist.currentSongIndex = songIndex - 1;
			playlistMenu(selectedPlaylist);
        } else {
            console.log("Invalid song number. Please try again.");
            playSpecificSong(selectedPlaylist);
        }
    });
}

/**
 * Plays the next song in the playlist or from the song queue and prompts the user to navigate to the next song or return to the playlist menu.
 * @param selectedPlaylist - The selected playlist.
 * @param playlists - The Playlist Database.
 * @returns Void.
 */
export function playNextSong(selectedPlaylist: Playlist, playlists: PlaylistData): void {
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
    } else if (playlists.songQueue.songs.length > 0) {
        console.log("Playing the next song from the song queue:");
        const currentSong = playlists.songQueue.songs[0];
        console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
        playlists.songQueue.songs.shift(); 
    } else {
        if (selectedPlaylist.currentSongIndex < selectedPlaylist.songs.length - 1) {
            const currentSongIndex = selectedPlaylist.currentSongIndex;
            selectedPlaylist.currentSongIndex = currentSongIndex + 1;
            const currentSong = selectedPlaylist.songs[selectedPlaylist.currentSongIndex];
            console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
        } else {
            selectedPlaylist.currentSongIndex = 0;
            const currentSong = selectedPlaylist.songs[0];
            console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
        }
    }
}

export function playNextSongCallback(selectedPlaylist: Playlist, playlists: PlaylistData): void {
    playNextSong(selectedPlaylist, playlists);
    playlistMenu(selectedPlaylist)
}

/**
 * Plays the previous song in the playlist and prompts the user to navigate to the next song or return to the playlist menu.
 * @param selectedPlaylist - The selected playlist.
 * @returns Void.
 */
export function playPreviousSong(selectedPlaylist: Playlist): void {
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty")
    } else if (selectedPlaylist.currentSongIndex === -1) {
        console.log("No song currently playing.");
    } else if (selectedPlaylist.currentSongIndex === 0) {
        const currentIndex = selectedPlaylist.songs.length - 1;
        const currentSong = selectedPlaylist.songs[currentIndex];
        console.log(`Now playing ${currentSong.title} - ${currentSong.artist}`);
        selectedPlaylist.currentSongIndex = currentIndex;
    } else {
        const currentIndex = selectedPlaylist.currentSongIndex - 1;
        const previousSong = selectedPlaylist.songs[currentIndex];
        console.log(`Now playing: ${previousSong.title} - ${previousSong.artist}`);
        selectedPlaylist.currentSongIndex = currentIndex;
    }
}

export function playPreviousSongCallback(selectedPlaylist: Playlist): void {
	playPreviousSong(selectedPlaylist);
    playlistMenu(selectedPlaylist);
}

/**
 * Plays a randomly selected song in the selected playlist.
 * @param selectedPlaylist - The selected playlist.
 * @returns Void.
 */
export function shuffleSong(selectedPlaylist: Playlist): void {
    if (selectedPlaylist.songs.length === 0) {
        console.log("Playlist is empty.");
    } else {
        const songs = selectedPlaylist.songs;
        const random_index = Math.floor(Math.random() * songs.length);
        const currentSong = selectedPlaylist.songs[random_index];
        console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
    }
}

export function shuffleSongCallback(selectedPlaylist: Playlist) {
    shuffleSong(selectedPlaylist);
    playlistMenu(selectedPlaylist);
}

