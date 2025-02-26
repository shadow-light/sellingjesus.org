---
image: /memes/wont_value.jpg
aside: false
---

<script lang='ts' setup>

import {onMounted, ref, computed} from 'vue'


const have_share = ref(false)
const have_clipboard = ref(false)
const show_copied = ref(false)


const share_label = computed(() => {
    return have_share.value ? "Share link" : (have_clipboard.value ? "Copy link" : null)
})


const share_img_instruct = computed(() => {
    return have_share.value ? "Click an image to share it." :
        (have_clipboard.value ? "Click an image to copy it." : null)
})


const flash_copied = () => {
    // Briefly show .copied div
    show_copied.value = true
    setTimeout(() => {
        show_copied.value = false
    }, 3000)
}


const share_img = async event => {
    // Share meme clicked on

    // Get PNG form for higher quality, and because some browsers don't support writing jpg yet
    // e.g. Chrome 108 desktop couldn't write a jpg to clipboard
    const url = event.target.src.replace('.jpg', '.png')  // NOTE Browser returns absolute URL
    const blob = await (await fetch(url)).blob()

    // Use Share API if available, otherwise fallback on clipboard
    // NOTE Don't use if not phone/tablet as desktop experience isn't great with no social apps available
    if (have_share.value && window.screen.width < 800){

        // Prepare data to share
        const file = new File([blob], 'selling_jesus_meme.png', {type: blob.type})
        const data = {
            url: 'https://sellingjesus.org',
            title: "Selling Jesus",
            files: [file],
        }

        // Try to share image data, otherwise fallback on sharing a link to the image
        if (self.navigator.canShare(data)){
            self.navigator.share(data)
        } else {
            self.navigator.share({
                url: url,  // URL of actual image so social sites will display it
                title: "Selling Jesus",
            })
        }

    } else if (have_clipboard.value){
        // Can't use Share API so write to clipboard and notify user
        await self.navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})])
        flash_copied()
    }
}


onMounted(() => {
    // Can only access browser API at runtime
    have_share.value = 'share' in self.navigator
    have_clipboard.value = 'clipboard' in self.navigator && 'ClipboardItem' in self
})


</script>


<style lang='sass' scoped>

.images
    display: flex
    flex-direction: column

    img
        margin-bottom: 48px
        cursor: pointer
        aspect-ratio: 1 / 1

    @media (min-width: 1000px)
        display: grid
        grid-template-columns: 1fr 1fr
        column-gap: 24px


.copied
    position: fixed
    bottom: 50%
    left: calc(50% - 220px)
    z-index: 999
    color: var(--vp-button-brand-text)
    background-color: var(--vp-c-brand)
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.5))
    font-size: 14px
    font-weight: bold
    padding: 6px 12px
    border-radius: 24px


.v-enter-active, .v-leave-active
    transition: opacity 0.5s ease

.v-enter-from, .v-leave-to
    opacity: 0


</style>


# Graphics

Feel free to share these to generate discussion and raise awareness of these issues.

__{{ share_img_instruct }}__


## Diagrams

All the information included below is [public information](https://apps.irs.gov/app/eos/) that the US government requires non-profits to disclose, including executive pay and hours worked. We do not give opinions in these diagrams. They are intended to generate discussion. Like [other ministries](https://ministrywatch.com/), we believe such transparency is important.

<div class='images'>
    <img @click='share_img' src='/infographics/trace_nkjv.jpg'>
    <img @click='share_img' src='/infographics/trace_niv.jpg'>
    <img @click='share_img' src='/infographics/trace_esv.jpg'>
    <img @click='share_img' src='/infographics/trace_songs.jpg'>
</div>


## Memes

::: details Why we use humor

We are sometimes asked why we publish memes and [satirical videos](/videos/humor) as they seem to some unfitting for the seriousness of the topic we are addressing. We do not publish them simply because we like memes or wish to mock others, as some other websites do. As pastors we hold ourselves to a high standard and our reasons are biblical:

 1. The prophets, apostles, and Jesus used satire to expose sin (1 Kings 18:27, 1 Cor 4:8-13, Gal 5:12, Luke 13:33, Matt 7:5, Matt 23) and were not afraid of offending people when necessary (Matt 15:12-14).
 2. Our satirical works are designed to expose the foolishness or hypocrisy inherent in certain views. Many of our memes simply apply modern day practices to the early church. They are intended to provoke thought, not just to get laughs.
 3. Our aim is to bring people to repentance (2 Cor 7:8-10). We assume most people have good intentions, and those who do turn from commercializing the faith should be shown abundant grace. But Scripture affirms there are some who are truly in ministry for the money (2 Cor 2:17, 1 Tim 6:5, Titus 1:11) and their façade needs to be exposed.

We strive to "speak the truth in love" (Eph 4:15) and not use humor beyond the standard set by Scripture itself. If anyone does find something to be inappropriate, we are very open to [discussing it](/about#contact).

:::

<div class='images'>
    <!-- Sweet Publishing -->
    <img @click='share_img' src='/memes/conference_discount.jpg'>
    <img @click='share_img' src='/memes/bible_copyright.jpg'>
    <img @click='share_img' src='/memes/music_royalties.jpg'>
    <img @click='share_img' src='/memes/paul_payment.jpg'>
    <img @click='share_img' src='/memes/wont_value.jpg'>
    <img @click='share_img' src='/memes/sell_spirit.jpg'>
    <img @click='share_img' src='/memes/your_saying.jpg'>
</div>
<div class='images'>
    <!-- Image-based -->
    <img @click='share_img' src='/memes/serve_both.jpg'>
    <img @click='share_img' src='/memes/modern_society.jpg'>
    <img @click='share_img' src='/memes/future_history.jpg'>
    <img @click='share_img' src='/memes/muzzle_ox.jpg'>
    <img @click='share_img' src='/memes/biblical_counseling.jpg'>
    <img @click='share_img' src='/memes/monetize_ministry.jpg'>
</div>
<div class='images'>
    <!-- Text-based -->
    <img @click='share_img' src='/memes/study_bible.jpg'>
    <img @click='share_img' src='/memes/temple_marketplace.jpg'>
    <img @click='share_img' src='/memes/all_rights_reserved.jpg'>
    <img @click='share_img' src='/memes/false_teacher.jpg'>
</div>


## Infographics

<div class='images'>
    <img @click='share_img' src='/infographics/info_cliff.jpg'>
    <img @click='share_img' src='/infographics/info_support.jpg'>
    <img @click='share_img' src='/infographics/info_sold_free.jpg'>
    <img @click='share_img' src='/infographics/info_math.jpg'>
</div>


<transition>
    <div v-if='show_copied' class='copied'>Copied! Now paste it somewhere</div>
</transition>


<small>* Bible illustrations by Sweet Publishing (CC BY-SA), text added.</small>
