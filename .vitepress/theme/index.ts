
import DefaultTheme from 'vitepress/theme'
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue'
import {Theme} from 'vitepress'

import CustomLayout from './CustomLayout.vue'
import PersonBio from '../../src/_comp/PersonBio.vue'
import ArticlePreview from '../../src/_comp/ArticlePreview.vue'
import FeaturePreview from '../../src/_comp/FeaturePreview.vue'
import BibleQuote from '../../src/_comp/BibleQuote.vue'
import PodcastPlayer from '../../src/_comp/PodcastPlayer.vue'

// Needed for translation widget
import 'https://static.elfsight.com/platform/platform.js'

import 'shikwasa/dist/style.css'
import './custom.sass'

export default {
    ...DefaultTheme,
    Layout: CustomLayout,
    enhanceApp(ctx){
        DefaultTheme.enhanceApp(ctx)
        // Global components
        ctx.app.component('VPButton', VPButton)
        ctx.app.component('PersonBio', PersonBio)
        ctx.app.component('ArticlePreview', ArticlePreview)
        ctx.app.component('FeaturePreview', FeaturePreview)
        ctx.app.component('BibleQuote', BibleQuote)
        ctx.app.component('PodcastPlayer', PodcastPlayer)
    },
} as Theme
