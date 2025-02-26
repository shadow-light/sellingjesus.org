---
title: Informative Videos
aside: false
---


<script lang='ts' setup>

import VideoType from './VideoType.vue'
import VideoPreview from '@/_comp/VideoPreview.vue'
import videos_doc from '../videos_doc.json'

</script>


<VideoType active='doc'></VideoType>


<VideoPreview v-for='episode of videos_doc' :key='episode.id' :episode='episode'></VideoPreview>
<div v-if='!videos_doc.length' style='text-align:center'>
    <h3>Coming soon...</h3>
    <p><a href='https://www.youtube.com/@SellingJesus' target='_blank'>Subscribe on Youtube</a> to get notified when they are available.</p>
</div>
