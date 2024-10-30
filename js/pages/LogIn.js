import { App } from '../index.js'
import { clearMainContentContainer, makeElements, $ } from '../utils.js'

export class LogIn {
	render() {
		let logIn = makeElements({
			type: 'div',
			name: 'login',
			classNames: ['container', 'pt-5'],
			children: [
				makeElements({ type: 'h1', contents: 'Log in' }),
				makeElements({
					type: 'form',
					name: 'login-form',
					children: [
						makeElements({
							type: 'div',
							classNames: ['mb-3'],
							children: [
								makeElements({
									type: 'label',
									attributes: { for: 'username-email' },
									classNames: ['form-label'],
									contents: 'Username or email',
								}),
								makeElements({
									type: 'input',
									attributes: {
										type: 'text',
										id: 'username-email',
										name: 'username-email',
										required: true,
									},
									classNames: ['form-control'],
								}),
							],
						}),
						makeElements({
							type: 'div',
							classNames: ['mb-3'],
							children: [
								makeElements({
									type: 'label',
									attributes: { for: 'password' },
									classNames: ['form-label'],
									contents: 'Password',
								}),
								makeElements({
									type: 'input',
									attributes: {
										type: 'password',
										id: 'password',
										name: 'password',
										required: true,
									},
									classNames: ['form-control'],
								}),
							],
						}),
						makeElements({
							type: 'div',
							classNames: ['feedback', 'mb-3', 'hidden'],
							contents: 'Invalid credentials. Please try again.',
						}),
						makeElements({
							type: 'div',
							classNames: ['mb-3'],
							children: [
								makeElements({
									type: 'button',
									classNames: ['btn', 'btn-primary'],
									contents: 'Log in',
								}),
							],
						}),
					],
				}),
			],
		})
		clearMainContentContainer()
		$('#content-container').append(logIn)
		$('#login-form').addEventListener('submit', async (event) => this.handleLogin(event))
	}
	async handleLogin(event) {
		event.preventDefault() // Prevent the form from submitting the default way

		const username = $('#username-email').value
		const password = $('#password').value

		try {
			const response = await fetch('https://01.kood.tech/api/auth/signin', {
				method: 'POST',
				headers: {
					Authorization: 'Basic ' + btoa(username + ':' + password),
				},
			})

			if (response.ok) {
				$('.feedback').classList.add('hidden')
				App.user.loggedIn = true
				const data = await response.json()

				// localStorage.setItem("jwt", data.jwt);
				const token = data
				localStorage.setItem('jwt', token)

				// Redirect to the home page
				history.pushState({}, '', '/')
				App.handleRoute()
			} else {
				$('.feedback').classList.remove('hidden')
			}
		} catch (error) {
			console.error('Error during login:', error)
			$('.feedback').classList.remove('hidden')
		}
	}
}
