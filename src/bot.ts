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
	console.log('Discord Loaded!'.rainbow)
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

// Main function
function checkParcelStatus() {
	console.log('\nChecking parel status..'.red)
	getParcelEvents().then(events => {
		const savedEvents = db.getData('/events')
		if(savedEvents.length != events.length){
			console.log('Length mismatch!'.rainbow)
						
			const latestEvent = events[0]
			
			// Notify user
			client.users.fetch(config.user).then(function(user) {
				user.send({	
				'content': '😎',
				'embeds': [{
					'title': 'New parcel update!',
					'description': '',
					'color': 0xff0000, // Red
					'fields': [
						{
						'name': 'Date',
						'value': latestEvent[0]
						},
				
						{
						'name': 'Hour',
						'value': latestEvent[1]
						},
				
						{
						'name': 'Description',
						'value': latestEvent[2]
						},
				
						{
						'name': 'Location',
						'value': latestEvent[3] == '' ? 'None' : latestEvent[3]
						}
					]
				}]})
			})
		} else {
			console.log('No changes')
		}
	})	
}

// Setup automatic updates
import { parse } from '@lukeed/ms'
setInterval(checkParcelStatus, parse(config.interval) as number)