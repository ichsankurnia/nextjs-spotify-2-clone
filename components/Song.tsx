import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSpotify from '../hooks/useSpotify';

type Props = {
    track: any,
    order: number
};

function millisToMinutesAndSeconds(millis: number) {
    let minutes = Math.floor(millis / 60000);
    let seconds: string = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? '0' : '') + seconds;
}

const Song: React.FC<Props> = ({ track, order }) => {
    const [currentTrackId, setCurrentTrackId] = useRecoilState<any>(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState<boolean>(isPlayingState)

    const spotifyApi = useSpotify()

    const playSong = async () => {
        setCurrentTrackId(track?.track?.id)
        setIsPlaying(true)
        spotifyApi.play({
            uris: [track?.track?.uri]
        }).catch((err: any) => console.log(err))
    }

    // console.log(track)
    return (
        <>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-2 px-4 py-2 text-sm text-gray-400 hover:bg-gray-900 rounded-lg' onClick={playSong}>
                <div className='flex items-center space-x-4'>
                    <p>{order}</p>
                    <img alt='' src={track?.track?.album?.images[0]?.url} className='block md:hidden xl:block w-10 h-10' />
                    <div className='flex flex-col'>
                        <h3 className='text-white w-48 md:w-36 xl:w-[16.5rem] truncate'>{track?.track?.name}</h3>
                        {/* <p>{track?.track?.artists.map((artist: any) => artist.name).join(', ')}</p> */}
                        <p>{track?.track?.artists.map((artist: any, key: number) => 
                            <Link href={artist?.external_urls.spotify} key={key}>
                                <a className='hover:underline hover:text-white w-48 md:w-36 xl:w-64 truncate'>{artist.name}{key<track?.track?.artists.length-1 && ', '}</a>
                            </Link>
                        )}</p>
                    </div>
                </div>
                <Link href={track?.track?.album?.external_urls?.spotify} ><a className='hover:underline hover:text-white hidden md:block'>{track?.track?.album?.name}</a></Link>
                <div className='xl:flex xl:justify-between'>
                    <p className='hidden xl:block'>{dayjs(track?.added_at).format('MMM DD, YYYY')}</p>
                    <p className='flex justify-end'>{millisToMinutesAndSeconds(track?.track?.duration_ms)}</p>
                </div>
            </div>

        </>
    );
}

export default Song;