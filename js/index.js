import { Navbar } from './components/Navbar.js'
import { NotFound } from './pages/NotFound.js'
import { LogIn } from './pages/LogIn.js'
import { Home } from './pages/Home.js'

export const App = {
	navbar: null,
	notFound_page: null,
	logIn_page: null,
	home_page: null,
	user: {
		username: null,
		loggedIn: null,
	},

	renderNavbar() {
		if (!this.navbar) {
			this.navbar = new Navbar()
			this.navbar.render()
		} else {
			this.navbar.render()
		}
	},

	renderNotFoundPage() {
		if (!this.notFound_page) {
			this.notFound_page = new NotFound()
			this.notFound_page.render()
		} else {
			this.notFound_page.render()
		}
	},
	renderHomePage() {
		if (!this.home_page) {
			this.home_page = new Home()
			this.home_page.render()
		} else {
			this.home_page.render()
		}
	},
	renderLogInPage() {
		if (!this.logIn_page) {
			this.logIn_page = new LogIn()
			this.logIn_page.render()
		} else {
			this.logIn_page.render()
		}
	},
	setUp: async function () {
		try {
			const token = localStorage.getItem('jwt')
			if (token) {
				App.user.loggedIn = true
			} else {
				App.user.loggedIn = false
			}
			return true
		} catch (error) {
			console.error('Error loading the login data:', error)
			throw error // Re-throw the error to maintain the promise chain
		}
	},
	handleRoute() {
		const path = window.location.pathname
		App.setUp().then(() => {
			switch (path) {
				case '/':
				case '':
					App.renderNavbar()
					App.user.loggedIn ? this.renderHomePage() : this.renderLogInPage()
					break
				case '/log-in':
					App.renderNavbar()
					this.renderLogInPage()
					break
				default:
					App.renderNavbar()
					this.renderNotFoundPage()
			}
		})
	},
}
document.addEventListener('DOMContentLoaded', function () {
	App.handleRoute()

	document.addEventListener('click', function (event) {
		if (event.target.tagName === 'A') {
			event.preventDefault()
			const path = event.target.getAttribute('href')
			console.log('pushState triggered. Path:', path)
			window.history.pushState({}, '', path)
			App.handleRoute()
		}
	})

	// Handle browser navigation events
	window.onpopstate = function (event) {
		console.log('Popstate triggered:', window.location.pathname)
		App.handleRoute(window.location.pathname)
	}
})
