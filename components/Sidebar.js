import { HomeIcon, SearchIcon, LibraryIcon, HeartIcon, RssIcon, PlusCircleIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import useSpotify from '../hooks/useSpotify'
import {playlistIdState} from '../atoms/playlistAtom'
import { useRecoilState } from 'recoil'

const Sidebar = () => {
	const [playlists, setPlaylists] = useState([])
	const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)

	const { data: session, status } = useSession()
	const spotifyApi = useSpotify()

	useEffect(() => {
		if (spotifyApi.getAccessToken()) {
			spotifyApi.getUserPlaylists().then((data) => {
				setPlaylists(data.body.items)
			})
		}
	}, [session, spotifyApi])

	console.log('Sidebar session :', session)
	
	return (
		<div className='text-gray-500 p-5 text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen w-[17rem] hidden md:block'>

			<div className='space-y-4 font-bold'>
				<img src='/logo.png' alt='' className='h-10 mb-8' />
				<button className='flex items-center space-x-2 hover:text-white'>
					<HomeIcon className='w-5 h-5' />
					<p>Home</p>
				</button>
				<button className='flex items-center space-x-2 hover:text-white'>
					<SearchIcon className='w-5 h-5' />
					<p>Search</p>
				</button>
				<button className='flex items-center space-x-2 hover:text-white'>
					<LibraryIcon className='w-5 h-5' />
					<p>Your Library</p>
				</button>
				<hr className='border-t-[0.1px] border-gray-900' />

				<button className='flex items-center space-x-2 hover:text-white'>
					<PlusCircleIcon className='w-5 h-5' />
					<p>Create Playlist</p>
				</button>
				<button className='flex items-center space-x-2 hover:text-white'>
					<HeartIcon className='w-5 h-5' />
					<p>Liked Songs</p>
				</button>
				<button className='flex items-center space-x-2 hover:text-white'>
					<RssIcon className='w-5 h-5' />
					<p>Your Episodes</p>
				</button>
				<hr className='border-t-[0.1px] border-gray-900' />

				{/* Playlist.... */}
				{playlists.map((data, key) => 
					<p key={key} className='cursor-pointer hover:text-white font-normal truncate'
						onClick={()=>setPlaylistId(data.id)}	
					>
						{data.name}
					</p>
				)}
			</div>
		</div>
	)
}

export default Sidebar