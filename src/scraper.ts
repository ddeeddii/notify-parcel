import * as puppeteer from 'puppeteer'
const config = require('../config/config.json')

export async function getParcelEvents() {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto(config.url)
	
	const allEvents = await page.evaluate(() => {
		// eslint-disable-next-line no-undef
		const eventsTable = document.querySelectorAll('.table-track>tbody td')
		
		const events: Array<Array<string>> = []
		let currentEvent: Array<string> = []
		let i = 0
		eventsTable.forEach((tableEntry) => {
			if(i == 4){
				i = 0
				events.push(currentEvent)
				currentEvent = []
			}
			currentEvent.push(tableEntry.textContent == null ? '' : tableEntry.textContent)
			i++
		})
		events.push(currentEvent)

		return Promise.resolve(events)
	})

	await browser.close()
	return allEvents
}