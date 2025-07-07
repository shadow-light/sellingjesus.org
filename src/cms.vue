
<script lang='ts' setup>

import type CMS from 'decap-cms-app'
import createReactClass from 'create-react-class'
import {createElement as h} from 'react'

import {cms_config} from './cms_config'
import {people} from './people.json'
import {data as articles_data} from './articles.data'
import {episodes} from './podcast.json'


// Build fails if CMS imported synchronously (even despite this being within <ClientOnly>)
// See https://github.com/decaporg/decap-cms/issues/3580
;(import('decap-cms-app') as unknown as Promise<typeof CMS>).then((cms) => {

    // Custom styles for previewer
    // WARN Affects preview of every collection
    // cms.registerPreviewStyle(`

    //     iframe {
    //         width: 100%;
    //         aspect-ratio: 16 / 9;
    //         border-style: none;
    //     }

    //     img {
    //         width: 100%;
    //     }

    // `, {raw: true})

    // Customise preview for episodes
    // cms.registerPreviewTemplate('episodes', createReactClass({
    //     render(){

    //         // Extract props
    //         const entry = this.props.entry
    //         const number = entry.getIn(['data', 'number'])
    //         const title = entry.getIn(['data', 'title'])
    //         const desc = entry.getIn(['data', 'desc'])
    //         const youtube_id = entry.getIn(['data', 'youtube'])
    //         const body = this.props.widgetFor('body')

    //         // Prepare data
    //         const episode = number ? `Episode ${number}` : ''
    //         const iframe_src = `https://www.youtube-nocookie.com/embed/${youtube_id}?modestbranding=1&rel=0`

    //         // Render
    //         return h('div', {},
    //             h('h2', {}, episode),
    //             h('h1', {}, title),
    //             h('p', {}, desc),
    //             h('iframe', {
    //                 src: iframe_src,
    //                 allow: 'fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
    //             }),
    //             h('div', {className: 'body'}, body),
    //         )
    //     }
    // }))

    cms.registerEditorComponent({
        id: 'bio',
        label: "Biography",
        fields: [
            {
                name: 'name',
                label: 'Name',
                widget: 'select',
                options: people.map(p => p.name),
            },
        ],
        pattern: /^<person-bio name="([^"]*?)"><\/person-bio>$/,
        fromBlock(match){
            return {
                name: match[1],
            }
        },
        toBlock(data){
            return `\n<person-bio name="${data.name}"></person-bio>\n`
        },
        toPreview(data){
            return `\n${data.summary}\n`
        },
        // Passed down to Decap object widget used to display this
        collapsed: true,
        summary: "{{name}}"
    })

    cms.registerEditorComponent({
        id: 'article',
        label: "Article button",
        fields: [
            {
                name: 'id',
                label: 'ID',
                widget: 'select',
                options: articles_data.map(p => ({
                    label: p.frontmatter.title,
                    value: p.url.split('/').pop(),
                })),
            },
        ],
        pattern: /^<article-preview id="([^"]*?)"><\/article-preview>$/,
        fromBlock(match){
            return {
                id: match[1],
            }
        },
        toBlock(data){
            return `\n<article-preview id="${data.id}"></article-preview>\n`
        },
        toPreview(data){
            return `\n${data.summary}\n`
        },
        // Passed down to Decap object widget used to display this
        collapsed: true,
        summary: "{{id}}"
    })

    cms.registerEditorComponent({
        id: 'podcast',
        label: "Podcast episode",
        fields: [
            {
                name: 'id',
                label: 'ID',
                widget: 'select',
                options: episodes.map(ep => ({label: ep.title, value: ep.id})),
            },
        ],
        pattern: /^<podcast-player id="([^"]*?)"><\/podcast-player>$/,
        fromBlock(match){
            return {
                id: match[1],
            }
        },
        toBlock(data){
            return `\n<podcast-player id="${data.id}"></podcast-player>\n`
        },
        toPreview(data){
            return `\n${data.summary}\n`
        },
        // Passed down to Decap object widget used to display this
        collapsed: true,
        summary: "{{id}}"
    })

    // Load CMS
    cms.init({config: cms_config})
})

</script>


<style lang='sass'>

// WARN NOT SCOPED
#nc-root

    ol, ul
        list-style-type: revert  // Vitepress sets globally as none :/

    img[alt="Logo"]
        margin: 0 auto
        width: 100px

    // Prevent cursor jump (https://github.com/decaporg/decap-cms/issues/5092#issuecomment-1246525269)
    [data-slate-editor="true"]
        -webkit-user-modify: read-write !important

html.dark #nc-root
    filter: brightness(75%)
    background-color: hsl(0, 0%, 20%)
    min-height: 100vh

    & > header
        filter: invert(1) hue-rotate(180deg)

</style>
