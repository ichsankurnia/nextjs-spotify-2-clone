import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import spotifyAPI from '../lib/spotify'

export async function refreshAccessToken(session) {
	try {
		spotifyAPI.setAccessToken(session.user.accessToken)
		spotifyAPI.setRefreshToken(session.user.refreshAccessToken)

		const { body } = await spotifyAPI.refreshAccessToken()
		console.log('refreshAccessToken :', body)

		const { refreshedTokens } = body

		spotifyAPI.setAccessToken(refreshedTokens.access_token)
	} catch (error) {
		console.log("Err Refreshing Access Token =>", error)
		signIn(); // Force sign in to hopefully resolve error
	}
}

const useSpotify = () => {
	const { data: session, status } = useSession()
	
	useEffect(() => {
		
		if(session){
			if (session?.error === "RefreshAccessTokenError") {
				signIn(); // Force sign in to hopefully resolve error
			}
			
			spotifyAPI.setAccessToken(session.user.accessToken)

			// spotifyAPI.getMe()
			// .then(function(data) {
			// 	console.log('Some information about the authenticated user', data.body);
			// }, function(err) {
			// 	console.log('Something went wrong!', err);
			// 	if(err.statusCode === 401){
			// 		refreshAccessToken()
			// 	}
			// });
		}
  }, [session]);

	return spotifyAPI
};

export default useSpotify;
