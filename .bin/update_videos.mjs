
import {writeFileSync, readFileSync} from 'fs'

import linkify from 'linkify-string'
import {google} from 'googleapis'

import settings from '../settings.json' with {type: 'json'}


// Get existing data
const playlist_type = process.argv[2]
const json_path = `src/videos_${playlist_type}.json`
const existing_videos = JSON.parse(readFileSync(json_path, 'utf8'))


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

        // See if have existing data
        const existing = existing_videos.find(v => v.id === video_id)

        videos.push({
            id: video_id,
            title: item.snippet.title,
            filename: existing?.filename ?? null,
            number: item.snippet.position + 1,
            type: playlist_type,
            image: `https://img.youtube.com/vi/${video_id}/hq720.jpg`,
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
writeFileSync(json_path, JSON.stringify(videos, undefined, 4))
