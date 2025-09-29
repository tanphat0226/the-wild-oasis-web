'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const BUTTON_FILTERS = [
	{ label: 'All cabins', value: 'all' },
	{ label: '1 - 3 guests', value: 'small' },
	{ label: '4 - 7 guests', value: 'medium' },
	{ label: '8 - 12 guests', value: 'large' },
]

function Filter() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()

	const activeFilter = searchParams?.get('capacity') ?? 'all'

	function handleFilter(filter) {
		const params = new URLSearchParams(searchParams)

		params.set('capacity', filter)

		router.replace(`${pathname}?${params.toString()}`, { scroll: false })
	}

	return (
		<div className='border border-primary-800 flex'>
			{BUTTON_FILTERS.map((button) => (
				<Button
					key={button.value}
					filter={button.value}
					handleFilter={handleFilter}
					activeFilter={activeFilter}
				>
					{button.label}
				</Button>
			))}
		</div>
	)
}

function Button({ filter, handleFilter, activeFilter, children }) {
	return (
		<button
			className={`px-5 py-2 hover:bg-primary-700 ${
				activeFilter === filter ? 'bg-primary-700' : ''
			}`}
			onClick={() => handleFilter(filter)}
		>
			{children}
		</button>
	)
}

export default Filter
