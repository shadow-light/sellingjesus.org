
<template lang='pug'>

div.book

    div.first-page
        h1 Abolish the Jesus Trade
        h2 The Joy of Freely Giving
        h3 By Andrew Case, Conley Owens, Jon Here, and other contributors
        h4 First Edition (July 2025)

    div.toc(class='break')
        h2 Contents
        template(v-for='section of toc')
            h3 {{ section.title }}
            div.toc-chapter(v-for='chapter of section.chapters' @click='goto(chapter.id)')
                | {{ chapter.title }}

    div.preface(class='break')
        p Preface...

    div(class='profiles_html break' v-html='profiles_html')

    div.convos
        div(class="titles break")
            h2(id="chapter-convo-general") 2. Conversations about Selling Jesus
            div(class="author") Andrew Case

        div(v-html='convo_general.intro')
        InstantMessages(file_id='conversations' :topics='convo_general.topics' book)

        div(class="titles break")
            h2(id="chapter-convo-corinthians") 3. Conversations between Paul and the Corinthians
            div(class="author") Conley Owens

        div(v-html='convo_corinthians.intro')
        InstantMessages(file_id='corinthians' :topics='convo_corinthians.topics' book)

    div(class='articles_html' v-html='articles_html')

</template>


<script lang='ts' setup>

import {useShadowRoot} from 'vue'

import InstantMessages from './_comp/InstantMessages.vue'
import {data as articles_data} from './book_articles.data'
import {data as profiles_data} from './book_profiles.data'
import convo_general from './learn/conversations_processed.json'
import convo_corinthians from './learn/corinthians_processed.json'

import styles from './book.sass?inline'


// Need to manually inject book styles into shadow DOM
defineOptions({
    styles: [styles],
})


// Util to demote all headings in HTML
function demote_headings(html:string){
    return html.replace(/<(\/?)h([1-6])\b/g, (_, slash, level) => {
        let newLevel = Math.min(parseInt(level) + 1, 6)
        return `<${slash}h${newLevel}`
    })
}


// Convert to object with ids
const articles = Object.fromEntries(articles_data.map(a => [a.url.split('/').pop(), a]))


// Explicitly exclude
delete articles['response-dr-b']


// Hard-code order of articles by section
const sections:Record<string, string[]> = {
    "Freely Give": ['freely-give', 'freely-give-today', 'scope'],
    "History": ['simony'],
    "Theology": ['defining-ministry', 'commerce-condemned', 'biblical-funding', 'colabor', 'sincerity', 'buying', 'judas'],
    "Specific Passages": ['selling-truth', 'temple-cleansing', '1cor9', '1cor9-authority', 'commercializing-gods-word'],
    "Application": ['should-preachers-be-paid', 'paying-pastors', 'covering-costs', 'biblical-counseling', 'ads', 'blood-money', 'pragmatism'],
    "Licensing & Copyright": ['copyright-jesus-command-to-freely-give', 'copyright-and-the-bible', 'abuse', 'copyright-hijacking', 'sharealike'],
    "Specific Ministries": ['bible-publishers', 'worship-tax', 'acbc', 'kjv'],
}


// Add any not yet hardcoded to "Additional" section
// NOTE Should move out of this section before actually publishing, it's just to ensure nothing missed
const all_hardcoded = Object.values(sections).flat()
const additional = []
for (const id in articles){
    if (!articles[id].frontmatter.category){
        continue  // No category is for April fools etc
    }
    if (articles[id].frontmatter.license){
        continue  // Exclude anything with a license (not public domain)
    }
    if (!all_hardcoded.includes(id)){
        additional.push(id)
    }
}
if (additional.length){
    sections["Additional"] = additional
}


// Concat all by section
let articles_html = ''
let ch = 1 + 3
for (const section in sections){

    articles_html += `<h1>${section}</h1>`

    for (const article_id of sections[section]){
        const article = articles[article_id]

        // Add titles/etc before concating
        articles_html += '<div class="titles break">'
        const title = article.frontmatter.title_h1 || article.frontmatter.title
        const subtitle = article.frontmatter.title_h2
        articles_html += `<h2 id="chapter-${article_id}">${ch}. ${title}</h2>`
        if (subtitle){
            articles_html += `<div class="subtitle">${subtitle}</div>`
        }
        articles_html += `<div class="author">${article.frontmatter.author}</div>`
        articles_html += '</div>'
        articles_html += demote_headings(article.html)
        ch++
        articles_html += `<div class='website'>For links to sources in this article, please visit: https://sellingjesus.org/articles/${article_id}</div>`
    }
}


// Prepare profiles HTML
const profiles_title = `
    <div class="titles">
        <h2 id="chapter-profiles">1. Christians Who Sell Jesus</h2>
        <div class="author">Andrew Case</div>
    </div>
`
const profiles_html = demote_headings(profiles_data[0].html)
    .replace(/<h2.*?<\/h2>/, profiles_title)


// Generate outline
interface OutlineChapter {
    id:string
    title:string
}

interface OutlineSection {
    title:string
    chapters:OutlineChapter[]
}

const toc:OutlineSection[] = [
    {title: "Introduction", chapters: [
        {id: "chapter-profiles", title: "1. Christians Who Sell Jesus"},
        {id: "chapter-convo-general", title: "2. Conversations about Selling Jesus"},
        {id: "chapter-convo-corinthians", title: "3. Conversations between Paul and the Corinthians"},
    ]},
]

function add_to_toc(html:string){

    // Parse given HTML
    const dom = new DOMParser().parseFromString(html, 'text/html')

    // Init state

    let current_section:OutlineSection|null = null

    // Loop through headings
    for (const el of dom.querySelectorAll('h1, h2')){
        const tag = el.tagName.toLowerCase()
        const title = el.textContent!.trim()

        // Handle new section
        if (tag === 'h1') {
            current_section = {
                title,
                chapters: [],
            }
            toc.push(current_section)

        // Handle new chapter
        } else if (tag === 'h2' && current_section) {
            current_section.chapters.push({
                title,
                id: el.id,
            })
        }
    }

    return toc
}


add_to_toc(articles_html)


// Navigate to chapter on click in TOC
const shadow = useShadowRoot()
const goto = (id:string) => {
    shadow?.querySelector('#' + id)?.scrollIntoView()
}


</script>
