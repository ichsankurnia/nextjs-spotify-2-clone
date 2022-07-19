import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest){
    // Token will exist if user logged in
    const token = await getToken({req, secret: 'spotify_2_clone_2022'})

    const { pathname } = req.nextUrl

    console.log(token)
    
    // Allow the requests if the following is true...
    // 1. Its a request for next-auth session && provider fetching
    // 2. the token exist
    
    if(pathname.includes('/api/auth') || token){
        return NextResponse.next()
    }

    // Redirect them to login if they dont have token AND requesting a protected route
    if(!token && pathname !== '/login'){
        const loginUrl = new URL('/login', req.url)

        return NextResponse.redirect(loginUrl);
    }
}

// Supports both a single value or an array of matches
export const config = {
    matcher: '/',
};