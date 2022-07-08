import { ClockIcon } from '@heroicons/react/outline';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { playlistState } from '../atoms/playlistAtom';
import Song from './Song';

type Props = {};

const SongLists: React.FC<Props> = ({ }) => {
    const playlist = useRecoilValue(playlistState)

    return (
        <>
            <div className='p-5 md:p-8 xl:p-10'>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-x-2 px-4 pb-2 border-b border-gray-800 uppercase text-sm text-gray-400 font-semibold'>
                    <div className='flex items-center space-x-4'>
                        <p>#</p>
                        <p>Title</p>
                    </div>
                    <p className='hidden md:block'>Album</p>
                    <div className='xl:flex xl:justify-between'>
                        <p className='hidden xl:block'>Date Added</p>
                        <span className='flex justify-end'>
                            <ClockIcon className='h-5 w-5' />
                        </span>
                    </div>
                </div>

                <div className='mt-4'>
                    {playlist?.tracks?.items?.map((track: any, index: number) =>
                        <Song track={track} order={index + 1} key={index} />
                    )}
                </div>
            </div>
        </>
    );
}

export default SongLists;