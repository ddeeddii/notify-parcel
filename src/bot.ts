// Global imports
import 'colors'
const config = require('../config/config.json')

console.log('\nInitalized notify-parcel\n')

// Initalize Discord Bot
import { Client, Intents } from 'discord.js'
const Discord = require('discord.js')

const myIntents = new Intents()
myIntents.add(Intents.FLAGS.DIRECT_MESSAGES)

const client: Client = new Discord.Client({ intents: myIntents })
client.login(config.token)

client.on('ready', () => {
	console.log('Discord loaded'.rainbow)
})

// Initalize & setup database
import { getParcelEvents } from './scraper'
import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

const db = new JsonDB(new Config('data/data.json', true, true, '/'))

function initDatabase(){
	try {
		// eslint-disable-next-line no-unused-vars
		const data = db.getData('/events')
		console.log('Database found!'.rainbow)
	} catch(error) {
		console.log('No database found'.red)
		console.log('Initalizing database with current events...')
		getParcelEvents().then(events => {
			db.push('/events', events)
			console.log('Database initalized!')
		})	
	}
}

initDatabase()

function arraysEqual(a: Array<any>, b: Array<any>) {
	return JSON.stringify(a) == JSON.stringify(b)
}

// Main function
function checkParcelStatus() {
	console.log('\nChecking parel status..'.red)
	getParcelEvents().then(events => {
		const savedEvents = db.getData('/events')
		if(savedEvents.length != events.length){
			console.log('Length mismatch!'.rainbow)
		
			const newEvents: Array<any> = []

			savedEvents.forEach((newEvent: Array<string>) => {
				newEvents.push(newEvent)				
				for(const oldEvent of events){					
					if(arraysEqual(newEvent, oldEvent)){						
						newEvents.pop()						
						break
					}
				}
			})
						
			//Notify user
			client.users.fetch(config.user).then(function(user) {
				newEvents.forEach(newEvent => {
					user.send({	
						'content': '😎',
						'embeds': [{
							'title': 'New parcel update!',
							'description': '',
							'color': 0xff0000, // Red
							'fields': [
								{
								'name': 'Date',
								'value': newEvent[0]
								},
						
								{
								'name': 'Hour',
								'value': newEvent[1]
								},
						
								{
								'name': 'Description',
								'value': newEvent[2]
								},
						
								{
								'name': 'Location',
								'value': newEvent[3] == '' ? 'None' : newEvent[3]
								}
							]
						}]})
				})
			})

			db.push('/events', events)
		} else {
			console.log('No changes')
		}
	})	
}

// Setup automatic updates
import { parse } from '@lukeed/ms'
setInterval(checkParcelStatus, parse(config.interval) as number)