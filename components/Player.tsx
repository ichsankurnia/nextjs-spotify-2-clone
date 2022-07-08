import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';

import { debounce } from 'lodash'

import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline'
import { FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, RewindIcon, VolumeUpIcon, SwitchHorizontalIcon } from '@heroicons/react/solid'

type Props = {};

const Player: React.FC<Props> = ({ }) => {
    const [currentTrackId, setCurrentTrackId] = useRecoilState<any>(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState<boolean>(isPlayingState)
    const [volume, setVolume] = useState(50)

    const { data: session, status } = useSession()

    const spotifyApi = useSpotify()
    const songInfo = useSongInfo()

    console.log(songInfo)

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data: any) => {
                console.log('Now playing :', data.body?.item)
                setCurrentTrackId(data?.body?.item?.id)

                spotifyApi.getMyCurrentPlaybackState().then((res: any) => {
                    setIsPlaying(res?.body?.is_playing)
                })
            })
        }
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong()
        }
    }, [currentTrackId, spotifyApi, session])


    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((res: any) => {
            setIsPlaying(res?.body?.is_playing)
            if (res?.body?.is_playing) {
                spotifyApi.pause().catch((err: any) => console.log(err))
                setIsPlaying(false)
            } else {
                spotifyApi.play().catch((err: any) => console.log(err))
                setIsPlaying(true)
            }
        })
    }

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debounceAdjustVolume(volume)
        }
    }, [volume])

    const debounceAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err: any) => console.log(err))
        }, 500),
        []
    )

    return (
        <>
            <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
                {/* LEFT */}
                <div className='flex items-center space-x-4'>
                    <img className='hidden md:block h-12 w-12' src={songInfo?.album?.images[0]?.url} alt='' />
                    <div>
                        <h3>{songInfo?.name}</h3>
                        <p>{songInfo?.artists.map((artist: any) => artist.name).join(', ')}</p>
                    </div>
                </div>

                {/* CENTER */}
                <div className='flex items-center justify-evenly'>
                    <SwitchHorizontalIcon className='button' />
                    <RewindIcon className='button'
                        onClick={() => spotifyApi.skipToPrevious().catch((err: any) => console.log(err))}
                    />
                    {isPlaying ?
                        <PauseIcon onClick={handlePlayPause} className='button w-10 h-10' />
                        :
                        <PlayIcon onClick={handlePlayPause} className='button w-10 h-10' />
                    }
                    <FastForwardIcon className='button'
                        onClick={() => spotifyApi.skipToNext().catch((err: any) => console.log(err))}
                    />
                    <ReplyIcon className='button' />
                </div>

                {/* RIGHT */}
                <div className='flex items-center justify-end space-x-3 md:space-x-4 pr-5'>
                    <VolumeDownIcon onClick={() => volume > 0 && setVolume(volume - 10)} className='button' />
                    <input type='range' className='w-14 md:w-28'
                        value={volume} onChange={(e) => setVolume(Number(e.target.value))}
                        min={0} max={100}
                    />
                    <VolumeUpIcon onClick={() => volume < 100 && setVolume(volume + 10)} className='button' />
                </div>
            </div>
        </>
    );
}

export default Player;