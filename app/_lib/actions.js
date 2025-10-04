'use server'

import { auth, signIn, signOut } from './auth'
import { supabase } from './supabase'

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
}

export async function signInAction() {
	await signIn('google', { redirectTo: '/account' })
}

export async function signOutAction() {
	await signOut({ redirectTo: '/' })
}
