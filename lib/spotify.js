import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
    // /* Images */
    'ugc-image-upload',
    // /* Spotify Connect */
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    // /* Users */
    'user-read-private',
    'user-read-email',
    // /* Follow */
    'user-follow-modify',
    'user-follow-read',
    // /* Library */
    'user-library-modify',
    'user-library-read',
    // /* Playback */
    'streaming',
    'app-remote-control',
    // /* Listening History */
    'user-read-playback-position',
    'user-top-read',
    'user-read-recently-played',
    // /* Playlists */
    'playlist-modify-private',
    'playlist-read-collaborative',
    'playlist-read-private',
    'playlist-modify-public'
].join(',')

const params = {
    scope: scopes
}

// https://accounts.spotify.com/authorize?params=user-read-email,playlist-modify-private

const queryParamString = new URLSearchParams(params)

const LOGIN_URL = 'https://accounts.spotify.com/authorize?' + queryParamString.toString()

const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SCREET
})

export default spotifyAPI

export { LOGIN_URL }