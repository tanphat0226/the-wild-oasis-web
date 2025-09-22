import '@/app/_styles/globals.css'
import { Josefin_Sans } from 'next/font/google'

import Logo from '@/app/_components/Logo'
import Navigation from '@/app/_components/Navigation'

const josefinSans = Josefin_Sans({
	subsets: ['latin'],
	display: 'swap',
})

export const metadata = {
	// title: 'The Wild Oasis',
	title: {
		template: '%s | The Wild Oasis',
		default: 'Welcome | The Wild Oasis',
	},
	description:
		'Luxurious cabin hotel, located in the heart of nature. Escape the city and unwind in our cozy cabins surrounded by breathtaking landscapes.',
}

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body
				className={`${josefinSans.className} bg-primary-950 text-primary-100 min-h-screen`}
			>
				<header>
					<Logo />
					<Navigation />
				</header>
				<main>{children}</main>
				<footer>Copyright by The Wild Oasis</footer>
			</body>
		</html>
	)
}
