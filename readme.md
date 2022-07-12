# notify-parcel
A simple way of tracking DPD parcel status updates using Discord for notifications and puppeteer for web scraping. Powered by Typescript

(Only tested on Polish DPD tracking website, see configuration>url)

## Setup
### Prerequisites
`node.js` - only tested on v16.15.0

`git`

### Getting Started
```
git clone https://github.com/ddeeddii/notify-parcel
cd notify-parcel
npm install
```
That will run the basic setup, however, for the app to run, you must configure it first.

### Configuration
The config file is located in `/config/config.json`
Available fields:
- `token`: Token of the bot running the app, get one from [here](https://discord.com/developers/applications)
- `user`: User id of the person receiving Direct Messages with the status updates.
- `url`: URL of the DPD tracking page. Example: `https://tracktrace.dpd.com.pl/parcelDetails?p1=x`
- `interval`: Time between every update. Default: `30m`

### Running
`npm run start` in the root directory will start the bot.