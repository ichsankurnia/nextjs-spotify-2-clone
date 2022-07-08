import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Center from '../components/Center'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Player from '../components/Player'

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden font-gotham">
      <Head>
        <title>Spotiffy 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className='flex'>
        <Sidebar />
        <Center />
      </main>


      {/* Footer */}
      <div className='sticky bottom-0'>
        <Player />
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  return {
    props: {
      session
    }
  }
}