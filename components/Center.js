import { ChevronDownIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify, { refreshAccessToken } from "../hooks/useSpotify";
import SongLists from "./SongLists";

const colors = [
	'from-red-500',
	'from-orange-500',
	'from-amber-500',
	'from-yellow-500',
	'from-lime-500',
	'from-green-500',
	'from-emerald-500',
	'from-teal-500',
	'from-cyan-500',
	'from-blue-500',
	'from-sky-500',
	'from-indigo-500',
	'from-violet-500',
	'from-purple-500',
	'from-fuchsia-500',
	'from-pink-500',
	'from-rose-500',
]

function Center() {
	const [color, setColor] = useState('')
	const [playlist, setPlaylist] = useRecoilState(playlistState)
	
	const playlistId = useRecoilValue(playlistIdState)
	const spotifyApi = useSpotify()
	const session = useSession()
	
	useEffect(()=> {
		setColor(colors[Math.floor(Math.random() * colors.length)])
	}, [playlistId])
	
	useEffect(() => {
		spotifyApi.getPlaylist(playlistId)
		.then((data) => {
			setPlaylist(data.body)
		}).catch((err) => {
			console.log('Err get playlist id : ', playlistId, err, err.statusCode)
			if(err.statusCode === 401){
				refreshAccessToken(session)
			}
		})
	}, [spotifyApi, playlistId])

	console.log("Current Playlist :", playlist)

	return (
		<div className="flex-grow text-white w-full overflow-y-scroll scrollbar-hide">
			<header className="absolute top-5 right-8">
				<div className="flex items-center space-x-3 opacity-90 bg-black hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 w-52" onClick={signOut}>
					<img className="w-8 h-8 rounded-full object-cover" src={session?.data?.user.image} alt="" />
					<h2 className="truncate">{session?.data?.user.name}</h2>
					<ChevronDownIcon className="h-5 w-5" />
				</div>
			</header>

			<section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} w-full h-80 p-8`}>
				<img src={playlist?.images[0]?.url} alt="" className='h-32 w-32 md:h-44 md:w-44 xl:h-52 xl:w-52 shadow-2xl' />
				<div>
					<p>PLAYLIST</p>
					<h1 className="text-2xl md:text-5xl xl:text-7xl font-bold mb-4 mt-2">{playlist?.name}</h1>
					<p className="text-gray-300 truncate">{playlist?.description}</p>
					<div className="flex item-center space-x-1.5 text-sm mt-1">
						<Link href={playlist?.owner?.external_urls?.spotify || '/'}><a className="font-semibold">{playlist?.owner?.display_name}</a></Link>
						<p>. {playlist?.tracks?.total} songs</p>
					</div>
				</div>
			</section>

			<SongLists />
		</div>
	)
}

export default Center;
