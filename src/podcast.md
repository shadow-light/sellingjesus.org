---
aside: false
---

<script lang='ts' setup>

import PodcastPreview from '@/_comp/PodcastPreview.vue'
import {episodes} from '@/podcast.json'

</script>


# Podcast

<p style='margin-bottom: 24px'>
    <VPButton theme='alt' text="Spotify" href='https://open.spotify.com/show/2dDRm550aeja4a8vdtHEck'></VPButton>
    <VPButton theme='alt' text="Apple Podcasts" href='https://podcasts.apple.com/us/podcast/selling-jesus/id1694183357'></VPButton>
    <VPButton theme='alt' text="Youtube" href='https://www.youtube.com/playlist?list=PLPZ4S3z9sIWw3etO-1Uhss_cm9SafUSvN'></VPButton>
    <VPButton theme='alt' text="RSS" href='https://anchor.fm/s/e3894160/podcast/rss'></VPButton>
</p>

<PodcastPreview v-for='pod of episodes' :key='pod.id' :pod='pod'></PodcastPreview>
