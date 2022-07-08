import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyAPI, { LOGIN_URL } from "../../../lib/spotify"


async function refreshAccessToken(token) {
    try {
        spotifyAPI.setAccessToken(token.accessToken)
        spotifyAPI.setRefreshToken(token.refreshAccessToken)

        const { body } = await spotifyAPI.refreshAccessToken()
        console.log('refreshAccessToken :', body)

        const { refreshedTokens } = body

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,		// = 1 hour as 3600 returns from spotify API
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
            // Replace if new one came back else fall back to old refresh token
        }
    } catch (error) {
        console.log(error)
        return {
            ...token,
            error: 'RefreshAccessTokenError'
        }
    }
}


export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            authorization: LOGIN_URL,
            // token?: string | TokenEndpointHandler,
            // userinfo?: string | UserinfoEndpointHandler,
            // type: "oauth",
            // version?: string,
            // profile?: (profile: P, tokens: TokenSet) => Awaitable<User & {
            //     id: string,
            // }>,
            // checks?: ChecksType | ChecksType[],
            // client?: Partial<ClientMetadata>,
            // jwks?: {
            // keys: JWK[],
            // },
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SCREET,
            /**
             * If set to `true`, the user information will be extracted
             * from the `id_token` claims, instead of
             * making a request to the `userinfo` endpoint.
             *
             * `id_token` is usually present in OpenID Connect (OIDC) compliant providers.
             *
             * [`id_token` explanation](https://www.oauth.com/oauth2-servers/openid-connect/id-tokens)
             */
            // idToken?: boolean,
            // region?: string,
            // issuer?: string,
            // /** Read more at: https://github.com/panva/node-openid-client/tree/main/docs#customizing-http-requests */
            // httpOptions?: HttpOptions,
            /**
             * The options provided by the user.
             * We will perform a deep-merge of these values
             * with the default configuration.
             */
            // options?: OAuthUserConfig<P>,
            // accessTokenUrl?: string,
            // requestTokenUrl?: string,
            // profileUrl?: string,
            // encoding?: string,
        }),
        // ...add more providers here
    ],
    secret: process.env.JWT_KEY,
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, user, account, profile, isNewUser }) {
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: Date.now() + account.expires_at * 1000,   // handling expiry times in Milliseconds hence * 1000
                }
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < token.accessTokenExpires) {
                console.log('EXISTING ACCESS TOKEN IS VALID')
                return token
            }

            // Access token has expired, so we need to redresh it..
            console.log('ACCESS TOKEN HAS EXPIRED, REFERSHING...')
            return await refreshAccessToken(token)
        },

        async session({ session, token }) {
            session.user.accessToken = token.accessToken,
            session.user.refreshToken = token.refreshToken,
            session.user.username = token.username

            return session
        }
    }
})