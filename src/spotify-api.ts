import axios from 'axios';
import { SongDatabase, Song, songData, PlaylistData, playlists, rl } from './types and constants';
import { mainMenu } from './menu';

// Set your Spotify API credentials
const clientId = 'b878d0f2353a473d90be7c966a105d09';
const clientSecret = '923899eb95e743ebba6a2f073d259a36';

// Set up the Spotify client credentials
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
        throw error;
    }
};

const getPlaylistInfo = async (accessToken: string, playlistUri: string) => {
    try {
        // Extract the playlist ID from the URI
        const playlistId = playlistUri.split('/').pop()?.split('?')[0];
  
        // Retrieve playlist details
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

const getPlaylistTracks = async (accessToken: string, playlistUri: string) => {
    try {
        // Extract the playlist ID from the URI
        const playlistId = playlistUri.split('/').pop()?.split('?')[0];
  
        // Retrieve tracks from the playlist
        const playlistResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        });
  
        const tracks = playlistResponse.data.items;
  
        if (!Array.isArray(tracks)) {
            console.error('Invalid response format. Expected an array of tracks.');
            console.log('Response:', playlistResponse.data);
            return [];
        }
  
        return tracks;
        } catch (error) {
            console.error('Error fetching playlist tracks:', error);
            throw error;
        }
};

const extractFeaturedArtists = (track: any) => {
    const featuredArtists = track.track.artists.slice(1).map((artist: any) => artist.name);
    return featuredArtists;
};

function addTrackToSongDb(trackName: string, artistName: string, albumName: string, featuredArtists: string, songDatabase: SongDatabase) {
    // Array dit alla collaborators
    const allFeaturedArtists: string[] = [];

    if (Array.isArray(featuredArtists) && featuredArtists.length > 0) {
        allFeaturedArtists.push(...featuredArtists);
    }

    const song: Song = {
        title: trackName,
        artist: artistName,
        album:  albumName,
        collaborators: allFeaturedArtists
    };

    songDatabase.songs.push(song);        
}

function addTrackToPlaylist(playlistName: string, trackName: string, artistName: string, albumName: string, featuredArtists: string[], playlists: PlaylistData) {
    // Array for all collaborators
    const allFeaturedArtists: string[] = [];
  
    if (Array.isArray(featuredArtists) && featuredArtists.length > 0) {
        allFeaturedArtists.push(...featuredArtists);
    }
  
    const song: Song = {
        title: trackName,
        artist: artistName,
        album: albumName,
        collaborators: allFeaturedArtists,
    };
  
    // Check if the playlist already exists, create it if not
    if (!playlists[playlistName]) {
        playlists[playlistName] = {
            name: playlistName,
            songs: [],
            currentSongIndex: 0,
        };
    }
  
    // Add the song to the playlist
    playlists[playlistName].songs.push(song);
}
  
const updateSongsDbAndPlaylistsDb = (tracks: any[], playlistName: string, playlists: PlaylistData, songDatabase: SongDatabase) => {
    if (!Array.isArray(tracks)) {
        console.error('Invalid response format. Expected an array of tracks.');
        return;
    }
  
    if (tracks.length === 0) {
        console.log('No tracks found in the playlist.');
        return;
    }
  
    tracks.forEach((track) => {
        const trackName = track.track.name;
        const artistName = track.track.artists[0].name;
        const albumName = track.track.album.name;
        const featuredArtists = extractFeaturedArtists(track);
    
        addTrackToSongDb(trackName, artistName, albumName, featuredArtists, songDatabase);
    
        // Replace 'your_playlist_name' with the desired playlist name
        addTrackToPlaylist(playlistName, trackName, artistName, albumName, featuredArtists, playlists);
    });
};
  
function extractPlaylistURI(url: string): string{
    // Split the URL by '/'
    const urlParts = url.split('/');
  
    // Get the last part of the URL (playlist URI)
    const playlistURI = urlParts[urlParts.length - 1];
  
    // Remove any query parameters (if present)
    const cleanPlaylistURI = playlistURI.split('?')[0];
  
    return cleanPlaylistURI;
}

export const importPlaylist = async () => {
    rl.question("Enter the URL to a Spotify playlist: ", async (url: string) => {
        try {
            const playlistUri = extractPlaylistURI(url);
  
            // Get access token
            const accessToken = await getToken();
  
            // Print playlist name
            const playlistInfo = await getPlaylistInfo(accessToken, playlistUri);
            const playlistName = playlistInfo.name;
    
            // Get and print the tracks from the playlist
            const playlistTracks = await getPlaylistTracks(accessToken, playlistUri);
            updateSongsDbAndPlaylistsDb(playlistTracks, playlistName, playlists, songData);
        } catch (error) {
            console.log('An error occurred:', error);
            mainMenu();
        } finally {
            mainMenu();
        }
    });
};

  
