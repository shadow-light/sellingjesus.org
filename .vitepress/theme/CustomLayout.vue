
<template lang='pug'>

Layout(:class='page_id')
    template(#nav-bar-content-after)
        TranslateButton.translate-nav
    template(#nav-screen-content-after)
        TranslateButton.translate-menu
    template(#doc-before)
        div.vp-doc
            ArticleIntro(v-if='page.relativePath.startsWith("articles/")')
    template(#doc-footer-before)
        PersonBio(v-if='frontmatter.author' :name='frontmatter.author')
    template(#doc-bottom)
        div.pd
            | All original content is freely given and <a href='/free'>dedicated to the public domain</a>.
            br
            | <a href='/ianal'>We do not give legal advice.</a>
    template(#home-hero-image)
        VideoPlayer(address='https://d2dho1yua3fd92.cloudfront.net/introduction.mp4.dash/')

</template>


<script lang='ts' setup>

import DefaultTheme from 'vitepress/theme'
import {computed, onMounted} from 'vue'
import {useData, useRoute, useRouter} from 'vitepress'

import {BibleEnhancer} from '@gracious.tech/fetch-enhancer'

import ArticleIntro from './ArticleIntro.vue'
import VideoPlayer from '../../src/_comp/VideoPlayer.vue'
import TranslateButton from '../../src/_comp/TranslateButton.vue'

import '@gracious.tech/fetch-client/client.css'
import '@gracious.tech/fetch-enhancer/styles.css'


const {page, frontmatter} = useData()
const {Layout} = DefaultTheme
const route = useRoute()

const page_id = computed(() => {
    // Place a custom page id on layout element so can customise whole page per route
    let id = 'route' + route.path.replace(/\//g, '_')
    if (id.endsWith('_index')){
        // For some reason the path includes 'index' in production (e.g. '/index')
        id = id.slice(0, 'index'.length*-1)  // WARN Don't remove the '_'
    }
    return id
})


onMounted(() => {

    const enhancer = new BibleEnhancer({
        app_args: {hue: '152'},
        before_history_push: () => {
            // Store scroll position for VitePress to prevent page jump
            history.replaceState({scrollPosition: window.scrollY}, '')
        },
    })

    const selector = '.VPDoc > .container > .content'

    useRouter().onAfterRouteChange = to => {
        const doc = document.querySelector(selector) as HTMLElement
        if (doc){
            enhancer.discover_bible_references(doc)
        }
    }

    const doc = document.querySelector(selector) as HTMLElement
    if (doc){
        enhancer.discover_bible_references(doc)
    }
})

</script>


<style lang='sass' scoped>

.pd
    text-align: center
    font-size: 12px
    opacity: 0.5
    padding-top: 200px
    padding-bottom: 100px

    a
        text-decoration: underline

.translate-nav
    margin-left: 16px
    @media (max-width: 767px)
        display: none

.translate-menu
    margin: 12px auto

</style>
