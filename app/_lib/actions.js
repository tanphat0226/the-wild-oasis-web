'use server'

import { revalidatePath } from 'next/cache'
import { auth, signIn, signOut } from './auth'
import { supabase } from './supabase'
import { getBookings } from './data-service'
import { redirect } from 'next/navigation'

function checkNationalID(id) {
	const idRegex = /^[a-zA-Z0-9]{6,12}$/
	return idRegex.test(id)
}

export async function updateProfile(formData) {
	const session = await auth()
	if (!session) throw new Error('Not authenticated')

	const nationalID = formData.get('nationalID')
	const [nationality, countryFlag] = formData.get('nationality').split('%')

	if (!checkNationalID(nationalID))
		throw new Error('Please provide a valid National ID number')

	const updateData = {
		nationalID,
		nationality,
		countryFlag,
	}

	const { data, error } = await supabase
		.from('guests')
		.update(updateData)
		.eq('id', session.user.guestId)

	if (error) {
		console.error(error)
		throw new Error('Profile could not be updated')
	}

	revalidatePath('/account/profile')
}

export async function deleteReservation(bookingId) {
	const session = await auth()
	if (!session) throw new Error('Not authenticated')

	const guestBookings = await getBookings(session.user.guestId)
	const guestBookingIds = guestBookings.map((b) => b.id)
	if (!guestBookingIds.includes(bookingId))
		throw new Error('You are not authorized to delete this booking')

	const { error } = await supabase
		.from('bookings')
		.delete()
		.eq('id', bookingId)

	if (error) {
		console.error(error)
		throw new Error('Booking could not be deleted')
	}

	revalidatePath('/account/reservations')
}

export async function updateBooking(formData) {
	const bookingId = Number(formData.get('bookingId'))

	// Authorization check
	const session = await auth()
	if (!session) throw new Error('Not authenticated')

	// Ensure the user owns the booking they're trying to update
	const guestBookings = await getBookings(session.user.guestId)
	const guestBookingIds = guestBookings.map((b) => b.id)
	if (!guestBookingIds.includes(bookingId))
		throw new Error('You are not authorized to update this booking')

	// Update booking
	const updateData = {
		numGuests: Number(formData.get('numGuests')),
		observations: formData.get('observations').slice(0, 1000), // max 1000 chars
	}

	// Mutation
	const { error } = await supabase
		.from('bookings')
		.update(updateData)
		.eq('id', bookingId)
		.select()
		.single()

	if (error) {
		throw new Error('Booking could not be updated')
	}

	// Revalidate the bookings page
	revalidatePath(`/account/reservations/edit/${bookingId}`)
	revalidatePath('/account/reservations')

	// Redirect to reservations page
	redirect('/account/reservations')
}

export async function signInAction() {
	await signIn('google', { redirectTo: '/account' })
}

export async function signOutAction() {
	await signOut({ redirectTo: '/' })
}
