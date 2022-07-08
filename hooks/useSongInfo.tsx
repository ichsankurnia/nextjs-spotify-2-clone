import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState } from '../atoms/songAtom';
import useSpotify from './useSpotify';

const useSongInfo = () => {
    const [currentTrackId, setCurrentTrackId] = useRecoilState<any>(currentTrackIdState)
    const [songInfo, setSongInfo] = useState<any>(null)

    const spotifyApi = useSpotify()
    
    useEffect(() => {
        const fetchSongInfo = async () => {
            if(currentTrackId){
                const trackInfo = await fetch(`https://api.spotify.com/v1/tracks/${currentTrackId}`, {
                    headers: {
                        Authorization: `Bearer ${spotifyApi.getAccessToken()}`
                    }
                }).then(res => res.json())
                .catch(err => {
                    console.log(err)
                    return null
                })

                setSongInfo(trackInfo)
            }
        }

        fetchSongInfo()
    }, [currentTrackId, spotifyApi])
    
    return songInfo
}

export default useSongInfo;