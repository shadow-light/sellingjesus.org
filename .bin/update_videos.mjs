
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
        part: 'snippet,status',
        playlistId: settings[`youtube_playlist_${playlist_type}`],
        maxResults: 50,
        pageToken: next_token,
    })

    // Only list public videos
    const items = resp.data.items.filter(item => item.status.privacyStatus === "public")

    // Add videos to the list
    for (const item of items){
        const video_id = item.snippet.resourceId.videoId
        videos.push({
            id: video_id,
            image: `https://img.youtube.com/vi/${video_id}/hqdefault.jpg`,
            type: playlist_type,
            number: item.snippet.position + 1,
            title: item.snippet.title,
            description: item.snippet.description.slice(0, 320),  // Display cuts at around 300
            description_html: linkify(item.snippet.description, {target: '_blank', defaultProtocol: 'https'})
                .replaceAll('\n', '<br>'),
        })
    }

    // Finish if no more items to get
    if (!resp.data.nextPageToken){
        break
    }
    next_token = resp.data.nextPageToken
}


// Save to file
writeFileSync(`src/videos_${playlist_type}.json`, JSON.stringify(videos))
