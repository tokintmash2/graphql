import { clearMainContentContainer, makeElements, $ } from '../utils.js'

export class NotFound {
	render() {
		let notFound = makeElements({ type: 'div', contents: 'Page not found' })
		clearMainContentContainer()
		$('#content-container').append(notFound)
	}
}
