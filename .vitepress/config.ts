
import path from 'path'

import MarkdownPluginFootnote from 'markdown-it-footnote'
import {defineConfig} from 'vitepress'

import settings from '../settings.json'
import videos_doc from '../src/videos_doc.json'
import videos_humor from '../src/videos_humor.json'
import videos_reactions from '../src/videos_reactions.json'
import {episodes as pods} from '../src/podcast.json'


const videos_sidebar = [
    {
        text: "Informative",
        items: videos_doc.map(episode => {
            return {
                link: `/videos/documentary/${episode.id}`,
                text: `${episode.title}`,
            }
        }),
    },
    {
        text: "Reactions",
        items: videos_reactions.map(episode => {
            return {
                link: `/videos/reactions/${episode.id}`,
                text: `${episode.title}`,
            }
        }),
    },
    {
        text: "Humor",
        items: videos_humor.map(episode => {
            return {
                link: `/videos/humor/${episode.id}`,
                text: `${episode.title}`,
            }
        }),
    },
]


// These will be grouped under a "More" item when screen narrows
const more_menu_items = [
    {text: "Podcast", link: '/podcast', activeMatch: '/podcast'},
    {text: "Graphics", link: '/graphics', activeMatch: '/graphics'},
    {text: "Take Action", link: '/act', activeMatch: '/act'},
    {text: "About", link: '/about', activeMatch: '/about'},
]


export default defineConfig({
    cleanUrls: true,  // Don't force `.html` on urls
    outDir: 'dist',
    srcDir: 'src',
    title: "Selling Jesus",
    description: settings.description,
    head: [
        ['link', {rel: 'icon', href: '/_assets/icon.png'}],
        // Required for Twitter to show any image at all
        ['meta', {name: 'twitter:card', content: 'summary'}],
        // WARN WhatsApp requires a URL with domain included
        ['meta', {property: 'og:image', content: 'https://sellingjesus.org/_assets/social.jpg'}],
        ['link', {
            rel: 'stylesheet',
            href: "https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700",
        }],
        // Needed for translation widget
        ['script', {
            src: 'https://static.elfsight.com/platform/platform.js',
            async: '',
        }],
    ],
    vite: {
        publicDir: '_public',
        resolve: {
            alias: [
                {find: '@', replacement: path.resolve(__dirname, '../src')},
            ],
        },
    },
    markdown: {
        config: (md) => {
            md.options.typographer = true
            md.use(MarkdownPluginFootnote)
            // Normalize Greek/Hebrew diacritic combos to single chars for better font support
            // WARN Chosen Greek font doesn't support diacritics when separate chars
            md.use((md) => md.core.ruler.after('inline', 'normalize-unicode', (state) => {
                for (const token of state.tokens){
                    if (token.type !== 'inline')
                        continue
                    for (const child of token.children ?? []) {
                        if (child.type === 'text') {
                            child.content = child.content.normalize('NFC')
                        }
                    }
                }
            }))
        },
    },
    themeConfig: {
        logo: '/_assets/icon.png',
        nav: [
            {text: "Articles", link: '/learn', activeMatch: '/(learn|articles)'},
            {text: "Videos", link: '/videos/documentary', activeMatch: '/videos'},
            {text: "More", items: more_menu_items},
            ...more_menu_items,
        ],
        socialLinks: [
            {link: 'https://www.youtube.com/@SellingJesus', icon: 'youtube'},
            {link: 'https://www.facebook.com/sellingjesus.org', icon: 'facebook'},
            {link: 'https://www.instagram.com/selling.jesus/', icon: 'instagram'},
            {link: 'https://twitter.com/Selling_Jesus', icon: 'x'},
        ],
        search: {
            provider: 'local',
            options: {
                // Include article titles in search indexing
                _render(src, env, md){
                    const html = md.render(src, env)
                    if (env.frontmatter?.title){
                        return md.render(`# ${env.frontmatter.title}`) + html
                    }
                    return html
                },
            },
        },
        sidebar: {
            '/videos/documentary/': videos_sidebar,
            '/videos/humor/': videos_sidebar,
            '/videos/reactions/': videos_sidebar,
            '/podcast/': [
                {
                    text: "Podcast",
                    items: pods.reverse().map(pod => {
                        return {
                            link: `/podcast/${pod.id}`,
                            text: `${pod.number}: ${pod.title}`,
                        }
                    }),
                },
            ],
        },
    },

    transformPageData(page_data){
        // Auto-set meta attributes from dynamic page data
        // See https://github.com/vuejs/vitepress/discussions/2285
        if (page_data.params?.title){
            page_data.title = page_data.params.title
        }
        if (page_data.params?.description){
            page_data.description = page_data.params.description
        }
    },

    transformHead(ctx){
        const head:[string, Record<string, string>][] = []

        // Twitter preview/card ignores <title> and meta description :/
        head.push(['meta', {name: 'og:title', content: ctx.title}])
        head.push(['meta', {name: 'og:description', content: ctx.description}])

        // Change og:image to match content when possible
        // See if `image` param has been passed to pageData (e.g. Podcast, videos)
        // Otherwise see if frontmatter specifies an image
        // And if neither then default site image will be used
        let image = ctx.pageData.params?.image ?? ctx.pageData.frontmatter.image
        if (image){
            if (image.startsWith('/')){
                // WhatsApp needs domain as well
                image = 'https://sellingjesus.org' + image
            }
            head.push(['meta', {property: 'og:image', content: image}])
        }

        return head
    },
})
