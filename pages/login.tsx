import { getProviders, signIn } from "next-auth/react"
import Image from 'next/image'

const Login = ({ providers }: any) => {
	console.log("Providers :", providers)

	return (
		<div className="bg-black min-h-screen flex flex-col justify-center items-center">
			<div className="w-52 h-52 mb-5 relative">
				<Image src="https://links.papareact.com/9xl" alt="" layout="fill" objectFit="cover" priority /* placeholder='blur' */ />
			</div>
			{Object.values(providers).map((data: any) => 
				<div key={data.id}>
					<button className="bg-[#18D860] text-white p-5 rounded-full"
						onClick={()=>signIn(data.id, {callbackUrl: '/'})}
					>
						Login with {data.name}
					</button>
				</div>
			)}
		</div>
	)
}

export default Login

export async function getServerSideProps() {
	const providers = await getProviders()

	return {
		props: {
			providers
		}
	}
}