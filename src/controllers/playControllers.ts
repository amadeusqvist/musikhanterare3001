import { Playlist, rl, PlaylistData, Song } from "../types and constants";
import { playlistMenu } from "../menu";
import { printSongsIndex, isValidSongIndex } from "./helperFunctions";

/**
 * Plays the first song in the playlist and prompts the user to navigate to the next song or return to the playlist menu.
 * @param selectedPlaylist - The selected playlist.
 * @returns Void.
 */
export function playPlaylist(selectedPlaylist: Playlist): void {
    const { songs } = selectedPlaylist;

    if (songs.length === 0) {
        console.log("Playlist is empty.");
        console.log();
        return;
    }

    const currentSong = songs[0];
    console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
    console.log();
    selectedPlaylist.currentSongIndex = 0;
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
    const { songs } = selectedPlaylist;

    if (songs.length === 0) {
        console.log("Playlist is empty.");
        console.log();
        playlistMenu(selectedPlaylist);
        return;
    }

    printSongsIndex(songs);

    rl.question("Enter the number of the song you wish to play: ", (answer: string): void => {
        const songIndex = parseInt(answer);

        if (isValidSongIndex(songIndex, songs)) {
            const currentSong = songs[songIndex - 1];
            console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
            console.log();
            selectedPlaylist.currentSongIndex = songIndex - 1;
            playlistMenu(selectedPlaylist);
        } else {
            console.log("Invalid song number. Please try again.");
            console.log();
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
    const { songs, currentSongIndex } = selectedPlaylist;
    const { songQueue } = playlists;

    if (songQueue.songs.length > 0) {
        console.log("Playing the next song from the song queue:");
        console.log();
        const currentSong = songQueue.songs[0]
        songQueue.songs.shift();
        console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
        console.log();
    } else if (songs.length === 0) {
        console.log("Playlist is empty.");
        console.log();
    } else {
        const newIndex = currentSongIndex < songs.length - 1 ? currentSongIndex + 1 : 0;
        selectedPlaylist.currentSongIndex = newIndex;

        const currentSong = songs[newIndex];
        console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
        console.log();
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
    const { songs, currentSongIndex } = selectedPlaylist;

    if (songs.length === 0) {
        console.log("Playlist is empty.");
        console.log();
        return;
    }

    if (currentSongIndex === -1) {
        console.log("Play a song in this playlist first.");
        console.log();
        return;
    }

    let newIndex;

    if (currentSongIndex === 0) {
        newIndex = songs.length - 1;
    } else {
        newIndex = currentSongIndex - 1;
    }

    const previousSong = songs[newIndex];
    console.log(`Now playing: ${previousSong.title} - ${previousSong.artist}`);
    console.log();
    selectedPlaylist.currentSongIndex = newIndex;
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
    const { songs } = selectedPlaylist;

    if (songs.length === 0) {
        console.log("Playlist is empty.");
        console.log();
        return;
    }

    const randomIndex = Math.floor(Math.random() * songs.length);
    selectedPlaylist.currentSongIndex = randomIndex;

    const currentSong = songs[randomIndex];
    console.log(`Now playing: ${currentSong.title} - ${currentSong.artist}`);
    console.log();
}

export function shuffleSongCallback(selectedPlaylist: Playlist) {
    shuffleSong(selectedPlaylist);
    playlistMenu(selectedPlaylist);
}

