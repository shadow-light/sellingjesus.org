
import {writeFileSync} from 'fs'

import linkify from 'linkify-string'
import {google} from 'googleapis'

import settings from '../settings.json' with {type: 'json'}


// Args
const playlist_type = process.argv[2]


// Auth
const auth = google.auth.fromAPIKey(process.env.YOUTUBE_API_KEY)


// Keep listing videos until all fetched
const videos = []
let next_token = null
while (true){

    // Send request
    const resp = await google.youtube('v3').playlistItems.list({
        auth,
        part: 'snippet',
        playlistId: settings[`youtube_playlist_${playlist_type}`],
        maxResults: 50,
        pageToken: next_token,
    })

    // Remove scheduled videos that appear as private
    const items = resp.data.items.filter(item => item.snippet.title !== "Private video")

    // Add videos to the list
    videos.push(...items.map(item => ({
        id: item.snippet.resourceId.videoId,
        type: playlist_type,
        number: item.snippet.position + 1,
        title: item.snippet.title,
        description: item.snippet.description.slice(0, 320),  // Display cuts at around 300
        description_html: linkify(item.snippet.description, {target: '_blank', defaultProtocol: 'https'})
            .replaceAll('\n', '<br>'),
    })))

    // Finish if no more items to get
    if (!resp.data.nextPageToken){
        break
    }
    next_token = resp.data.nextPageToken
}


// Save to file
writeFileSync(`src/videos_${playlist_type}.json`, JSON.stringify(videos))
