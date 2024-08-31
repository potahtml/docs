import { useBeforeLeave } from 'pota/web'

function Example() {
	// prevents navigation
	useBeforeLeave(() => false)

	// prevents navigation async
	useBeforeLeave(async () => false)

	// prevents navigation async resolving to false
	useBeforeLeave(
		() =>
			new Promise((resolve, reject) => {
				setTimeout(() => resolve(false), 5_000)
			}),
	)

	// prevents navigation async rejecting
	useBeforeLeave(
		() =>
			new Promise((resolve, reject) => {
				setTimeout(() => reject(), 5_000)
			}),
	)

	// page will navigate but only after three seconds
	useBeforeLeave(
		() =>
			new Promise((resolve, reject) => {
				setTimeout(() => resolve(true), 3_000)
			}),
	)
}
