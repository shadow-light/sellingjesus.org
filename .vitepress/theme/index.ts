
import DefaultTheme from 'vitepress/theme'
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue'
import {Theme} from 'vitepress'
import {BibleEnhancer} from '@gracious.tech/fetch-enhancer'

import CustomLayout from './CustomLayout.vue'
import PersonBio from '../../src/_comp/PersonBio.vue'
import ArticlePreview from '../../src/_comp/ArticlePreview.vue'
import FeaturePreview from '../../src/_comp/FeaturePreview.vue'
import BibleQuote from '../../src/_comp/BibleQuote.vue'
import PodcastPlayer from '../../src/_comp/PodcastPlayer.vue'
import YouTube from '../../src/_comp/YouTube.vue'

import 'shikwasa/dist/style.css'
import '@gracious.tech/fetch-client/client.css'
import '@gracious.tech/fetch-enhancer/styles.css'
import './custom.sass'

export default {
    ...DefaultTheme,
    Layout: CustomLayout,
    enhanceApp(ctx){

        // Extend default theme
        DefaultTheme.enhanceApp(ctx)

        // Global components
        ctx.app.component('VPButton', VPButton)
        ctx.app.component('PersonBio', PersonBio)
        ctx.app.component('ArticlePreview', ArticlePreview)
        ctx.app.component('FeaturePreview', FeaturePreview)
        ctx.app.component('BibleQuote', BibleQuote)
        ctx.app.component('PodcastPlayer', PodcastPlayer)
        ctx.app.component('YouTube', YouTube)

        if (!import.meta.env.SSR){

            // Enhancer
            let enhancer:BibleEnhancer|undefined
            ctx.router.onAfterPageLoad = to => {

                // Init enhancer after first page mounted (as can't init until DOM ready anyway)
                if (!enhancer){
                    enhancer = new BibleEnhancer({
                        app_args: {hue: '152'},
                        before_history_push: () => {
                            // Store scroll position for VitePress to prevent page jump
                            history.replaceState({scrollPosition: window.scrollY}, '')
                        },
                    })
                }

                // Detect references only within the content part of the page
                const selector = '.VPDoc > .container > .content'
                const doc = document.querySelector(selector) as HTMLElement
                if (doc){
                    enhancer.discover_bible_references(doc)
                }
            }

            // Preserve lang query param when navigating so that sharing URL preserves language choice
            // (Elfsight will auto-add the lang param, but Vitepress will lose it when changing page)
            let prev_lang:string|null = null
            ctx.router.onBeforeRouteChange = to => {
                prev_lang = new URLSearchParams(self.location.search).get('lang')
            }
            ctx.router.onAfterRouteChange = to => {
                const current_lang = new URLSearchParams(self.location.search).get('lang')
                if (prev_lang && !current_lang){
                    const new_url = new URL(self.location.href)
                    new_url.searchParams.set('lang', prev_lang)
                    self.history.replaceState(self.history.state, '', new_url.href)
                }
            }
        }
    },
} as Theme
