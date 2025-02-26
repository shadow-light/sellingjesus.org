
import {execSync} from 'node:child_process'
import {readFileSync, writeFileSync} from 'node:fs'

import podcast_json from '../src/podcast.json' assert {type: 'json'}


// Which episode to convert (defaults to latest)
const episode_num = parseInt(process.argv[2] ?? 0)
const episode = podcast_json.episodes[episode_num]


// Download image and audio
const audio_ext = episode.audio.split('.').at(-1)
writeFileSync('image.jpg', Buffer.from(await (await fetch(episode.image)).arrayBuffer()))
writeFileSync(`audio.${audio_ext}`, Buffer.from(await (await fetch(episode.audio)).arrayBuffer()))


// Generate video image
let svg_data = readFileSync('template.svg', {encoding: 'utf8'})
svg_data = svg_data.replace('EPISODE_TEXT', episode.title.replace('&', '&amp;'))
execSync('inkscape --pipe --export-overwrite -o video_bg.png', {input: svg_data})


// Generate video
const ffmpeg_command = `ffmpeg -y -i audio.${audio_ext} -loop 1 -i video_bg.png -filter_complex \
    "[0:a]showwaves=draw=full:s=640x150:colors=0x446655:mode=cline[v];[1:v][v]overlay=100:900[outv]" \
    -map "[outv]" -map 0:a -shortest -c:a copy "${episode.title}.mp4"`
console.log(ffmpeg_command)
execSync(ffmpeg_command)


// Data to copy paste to Youtube
console.log(`

${episode.description.split('sellingjesus.org')[0]}

LEARN MORE
https://sellingjesus.org
https://thedoreanprinciple.org
https://copy.church

PODCAST ALSO AVAILABLE ON...
Spotify - https://open.spotify.com/show/2dDRm550aeja4a8vdtHEck
Apple Podcasts - https://podcasts.apple.com/us/podcast/selling-jesus/id1694183357
RSS - https://anchor.fm/s/e3894160/podcast/rss

`)
