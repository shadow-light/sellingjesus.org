---
title: Reactions
aside: false
---


<script lang='ts' setup>

import VideoType from './VideoType.vue'
import VideoPreview from '@/_comp/VideoPreview.vue'
import videos_reactions from '../videos_reactions.json'

</script>


<VideoType active='reactions'></VideoType>

<VideoPreview v-for='episode of videos_reactions' :key='episode.id' :episode='episode'></VideoPreview>
