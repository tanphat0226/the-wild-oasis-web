import { auth } from '@/app/_lib/auth'
import { getBookedDatesByCabinId, getSettings } from '@/app/_lib/data-service'
import DateSelector from './DateSelector'
import ReservationForm from './ReservationForm'
import LoginMessage from './LoginMessage'

async function Reservation({ cabin }) {
	const [settings, bookedDates] = await Promise.all([
		getSettings(),
		getBookedDatesByCabinId(cabin.id),
	])
	const session = await auth()
	return (
		<div className='grid grid-cols-[auto_auto] border border-primary-800 min-h-[100px]'>
			<DateSelector
				settings={settings}
				bookedDates={bookedDates}
				cabin={cabin}
			/>

			{session?.user ? (
				<ReservationForm cabin={cabin} user={session.user} />
			) : (
				<LoginMessage />
			)}
		</div>
	)
}

export default Reservation
