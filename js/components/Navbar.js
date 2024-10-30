import { App } from '../index.js'
import { $, makeElements } from '../utils.js'
export class Navbar {
	constructor() {
		this.navbar = $('.navbar')
	}
	render() {
		if ($('.navbar')) {
			$('.navbar').remove()
		}
		const navbar = makeElements({
			type: 'nav',
			classNames: ['navbar'],
			children: [
				makeElements({
					type: 'div',
					classNames: ['container'],
					children: [
						makeElements({
							type: 'a',
							classNames: ['navbar-brand'],
							attributes: { href: '#' },
							children: [
								makeElements({
									type: 'img',
									attributes: {
										src: '../images/logo.png',
										height: '30px',
									},
								}),
							],
						}),
					],
				}),
			],
		})
		$('#app').prepend(navbar)
		if (App.user.loggedIn) {
			const logout = makeElements({
				type: 'button',
				classNames: ['btn', 'btn-outline-secondary'],
				name: 'logout',
				contents: 'Log out',
			})
			$('.navbar .container').append(logout)

			$('#logout').addEventListener('click', () => {
				console.log('Logout button clicked')
				localStorage.removeItem('jwt')
				App.user.loggedIn = false
				history.pushState({}, '', '/')
				App.handleRoute()
			})
		}
	}
}
