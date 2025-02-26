---
title: Humor
aside: false
---


<script lang='ts' setup>

import VideoType from './VideoType.vue'
import VideoPreview from '@/_comp/VideoPreview.vue'
import videos_humor from '../videos_humor.json'

</script>


<VideoType active='humor'></VideoType>


::: details Why we use humor

We are sometimes asked why we publish [memes](/graphics) and satirical videos as they seem to some unfitting for the seriousness of the topic we are addressing. We do not publish them simply because we like memes or wish to mock others, as some other websites do. As pastors we hold ourselves to a high standard and our reasons are biblical:

 1. The prophets, apostles, and Jesus used satire to expose sin (1 Kings 18:27, 1 Cor 4:8-13, Gal 5:12, Luke 13:33, Matt 7:5, Matt 23) and were not afraid of offending people when necessary (Matt 15:12-14).
 2. Our satirical works are designed to expose the foolishness or hypocrisy inherent in certain views. Many of our memes simply apply modern day practices to the early church. They are intended to provoke thought, not just to get laughs.
 3. Our aim is to bring people to repentance (2 Cor 7:8-10). We assume most people have good intentions, and those who do turn from commercializing the faith should be shown abundant grace. But Scripture affirms there are some who are truly in ministry for the money (2 Cor 2:17, 1 Tim 6:5, Titus 1:11) and their façade needs to be exposed.

We strive to "speak the truth in love" (Eph 4:15) and not use humor beyond the standard set by Scripture itself. If anyone does find something to be inappropriate, we are very open to [discussing it](/about#contact).

:::

<VideoPreview v-for='episode of videos_humor' :key='episode.id' :episode='episode'></VideoPreview>
<div v-if='!videos_humor.length' style='text-align:center'>
    <h3>Coming soon...</h3>
    <p><a href='https://www.youtube.com/@SellingJesus' target='_blank'>Subscribe on Youtube</a> to get notified when they are available.</p>
</div>
