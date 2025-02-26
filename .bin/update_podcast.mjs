/* This will update podcast.json
    * Only keeps episodes still in Spotify
    * Will add new episodes
    * Most fields editable via CMS
*/

import {writeFileSync} from 'fs'

import Spotify from 'spotify-web-api-node'
import MarkdownIt from 'markdown-it'
import {JSDOM} from 'jsdom'

import settings from '../settings.json' assert {type: 'json'}
import existing_items from '../src/podcast.json' assert {type: 'json'}


const markdowner = new MarkdownIt({linkify: true, typographer: true, html: true})


// Configure instance
const spotify = new Spotify({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
})


// Get access token
const credentials = await spotify.clientCredentialsGrant()
spotify.setAccessToken(credentials.body.access_token)


// Cache anchor data
let title_to_audio


// Get list of episodes
const episodes = []
let offset = 0
while (true){

    // Send request
    // NOTE market is required
    const resp = await spotify.getShowEpisodes(settings.spotify_show,
        {limit: 50, offset, market: 'US'})

    // Add episodes
    // WARN May have a null item in list (for scheduled episodes?)
    episodes.push(...await Promise.all(resp.body.items.filter(i => i).map(async episode => {

        // See if existing data present
        const existing = existing_items.episodes.find(e => e.id === episode.id)

        // Work out description
        let desc_html = ''
        if (existing?.description_md){
            desc_html = markdowner.render(existing?.description_md ?? '')
        } else {
            desc_html = episode.html_description
                .replace(/<p>(<br\/>)?<a href="https:\/\/sellingjesus.*?<\/p>/i, '')  // Remove links at end
        }

        // Discover audio url
        let audio = existing?.audio
        if (!audio){
            if (!title_to_audio){
                // Get data from Anchor (old platform which is now "Spotify for Podcasters")
                const anchor_resp = await (await fetch('https://anchor.fm/s/e3894160/podcast/rss')).text()
                const parser = new (new JSDOM()).window.DOMParser()
                // NOTE Parsing as HTML so doesn't skip unescaped `&`
                // See https://github.com/jsdom/jsdom/issues/3266
                const anchor_doc = parser.parseFromString(anchor_resp, 'text/html')
                title_to_audio = {}
                anchor_doc.querySelectorAll('item').forEach(item => {
                    const title = item.querySelector('title').textContent
                        .slice('<![CDATA['.length, ']]>'.length * -1).trim()
                    title_to_audio[title] = item.querySelector('enclosure').getAttribute('url')
                })
            }
            audio = title_to_audio[episode.name]
        }

        return {
            id: episode.id,
            title: existing?.title?.trim() || episode.name,
            /* While desc md and html may be same contents, CMS needs md to be able to still edit
                description: plain-text from Spotify, only used for previews so not overridable
                description_md: Used for html, addable via CMS only
                description_html: Render form of description_md, or otherwise from Spotify
            */
            description: episode.description,
            description_html: desc_html,
            description_md: existing?.description_md ?? '',
            transcript_md: existing?.transcript_md ?? '',
            transcript_html: markdowner.render(existing?.transcript_md ?? ''),
            // Not editable
            audio,
            duration: episode.duration_ms,
            date: episode.release_date,
            image: episode.images[0]?.url,  // First should be largest (640x640)
        }
    })))

    // Finish if no more
    if (!resp.body.next){
        break
    }
    offset += resp.body.items.length
}


// Add numbers
let num = episodes.length
for (const episode of episodes){
    episode.number = num
    num -= 1
}


// Save to file
writeFileSync('src/podcast.json', JSON.stringify({episodes}, undefined, 4))
