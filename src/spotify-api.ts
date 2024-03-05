import axios from 'axios';
import { SongDatabase, Song, songData, PlaylistData, playlists, rl } from './dataHandler';
import { mainMenu } from './menu';

//Spotify API client credentials
const clientId = 'b878d0f2353a473d90be7c966a105d09';
const clientSecret = '923899eb95e743ebba6a2f073d259a36';

/**
 * Fetches the Spotify access token using client credentials and returns it.
 * @returns Promise<string> - A promise that resolves to the access token.
 */
const getToken = async () => {
    const authBuffer = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const authHeaders = {
        headers: {
        Authorization: `Basic ${authBuffer}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    const authData = 'grant_type=client_credentials';

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', authData, authHeaders);
        return response.data.access_token;
    } catch (error) {
        console.log('Error fetching access token:', error);
        console.log();
        throw error;
    }
};

/**
 * Retrieves information about a Spotify playlist using the provided access token and playlist URI.
 * @param accessToken - The Spotify access token.
 * @param playlistUri - The URI of the Spotify playlist.
 * @returns Promise<{ name: string, collaborators: boolean }> - A promise that resolves to an object containing playlist information.
 */
const getPlaylistInfo = async (accessToken: string, playlistUri: string) => {
    try {
        const playlistId = playlistUri.split('/').pop()?.split('?')[0];
  
        const playlistResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        });
  
        const playlistInfo = {
            name: playlistResponse.data.name,
            collaborators: playlistResponse.data.collaborative,
        };
  
        return playlistInfo;
        } catch (error) {
            console.error('Error fetching playlist info:', error);
            throw error;
        }
};

/**
 * Retrieves tracks from a Spotify playlist using the provided access token and playlist URI.
 * @param accessToken - The Spotify access token.
 * @param playlistUri - The URI of the Spotify playlist.
 * @returns Promise<Array<any>> - A promise that resolves to an array of tracks.
 */
const getPlaylistTracks = async (accessToken: string, playlistUri: string) => {
    try {
        const playlistId = playlistUri.split('/').pop()?.split('?')[0];
  
        const playlistResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        });
  
        const tracks = playlistResponse.data.items;
  
        if (!Array.isArray(tracks)) {
            console.error('Invalid response format. Expected an array of tracks.');
            console.log('Response:', playlistResponse.data);
            console.log();
            return [];
        }
  
        return tracks;
        } catch (error) {
            console.error('Error fetching playlist tracks:', error);
            throw error;
        }
};

/**
 * Extracts featured artists from a track object.
 * @param track - The track object.
 * @returns - An array of featured artists.
 */
const extractFeaturedArtists = (track: any): Array<string> => {
    return track.track.artists.slice(1).map((artist: any) => artist.name);
};

/**
 * Creates a Song object based on track details.
 * @param trackName - The name of the track.
 * @param artistName - The name of the artist.
 * @param albumName - The name of the album.
 * @param featuredArtists - An array of featured artists.
 * @returns - The Song object.
 */
export const createSong = (trackName: string, artistName: string, albumName: string, featuredArtists: Array<string>): Song => {
    return {
        title: trackName,
        artist: artistName,
        album: albumName,
        collaborators: featuredArtists || [],
    };
};

/**
 * Adds a track to the Song Database.
 * @param song - A song.
 * @param songDatabase - The Song Database object.
 * @returns Void.
 */
export const addTrackToSongDb = (song: Song, songDatabase: SongDatabase): void => {
    songDatabase.songs.push(song);
};

/**
 * Adds a track to a playlist in the Playlist Database.
 * @param playlistName - The name of the playlist.
 * @param song - A song.
 * @param playlists - The Playlist Database object.
 * @returns Void.
 */
export const addTrackToPlaylist = (playlistName: string, song: Song, playlists: PlaylistData): void => {

    if (!playlists[playlistName]) {
        playlists[playlistName] = {
            name: playlistName,
            songs: [],
            currentSongIndex: 0,
        };
    }

    playlists[playlistName].songs.push(song);
};

/**
 * Updates the Song Database and Playlist Database with the provided tracks and playlist name.
 * @param tracks - An array of tracks to be added to the databases.
 * @param playlistName - The name of the playlist.
 * @param playlists - The Playlist Database object.
 * @param songDatabase - The Song Database object.
 * @returns Void.
 */
export const updateSongsDbAndPlaylistsDb = (tracks: Array<any>, playlistName: string, playlists: PlaylistData, songDatabase: SongDatabase): void => {
    if (!Array.isArray(tracks)) {
        console.error('Invalid response format. Expected an array of tracks.');
        return;
    }

    if (tracks.length === 0) {
        console.log('No tracks found in the playlist.');
        console.log();
        return;
    }

    tracks.forEach((track) => {
        const trackName: string = track.track.name;
        const artistName: string = track.track.artists[0].name;
        const albumName: string = track.track.album.name;
        const featuredArtists = extractFeaturedArtists(track);
        const song: Song = createSong(trackName, artistName, albumName, featuredArtists);

        addTrackToSongDb(song, songDatabase);
        addTrackToPlaylist(playlistName, song, playlists);
    });
};

/**
 * Extracts the Spotify playlist URI from a given URL.
 * @param url - The URL of the Spotify playlist.
 * @returns string - The extracted playlist URI.
 */
function extractPlaylistURI(url: string): string{
    const urlParts = url.split('/');
    const playlistURI = urlParts[urlParts.length - 1];
    const cleanPlaylistURI = playlistURI.split('?')[0];
    return cleanPlaylistURI;
}

/**
 * Imports a Spotify playlist by prompting the user to enter the URL and updating the Song Database and Playlist Database.
 * @returns void.
 */
export const importPlaylist = async () => {
    rl.question("Enter the URL to a Spotify playlist: ", async (url: string) => {
        try {
            const playlistUri = extractPlaylistURI(url);
            const accessToken = await getToken();

            const playlistInfo = await getPlaylistInfo(accessToken, playlistUri);
            const playlistName = playlistInfo.name;    
            const playlistTracks = await getPlaylistTracks(accessToken, playlistUri);

            updateSongsDbAndPlaylistsDb(playlistTracks, playlistName, playlists, songData);
        } catch (error) {
            console.log('An error occurred:', error);
            console.log();
        } finally {
            mainMenu();
        }
    });
};

  
