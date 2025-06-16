
<template lang='pug'>

div.book

    div.first-page
        h1 Abolish the Jesus Trade
        h3 The Joy of Freely Giving
        h3 By Andrew Case, Conley Owens, Jon Here, and other contributors
        h4 First Edition (July 2025)
        div.dedication
            p This book is freely given to the glory of God and dedicated to the public domain. It may be copied, translated, adapted, in whole or in part, without needing to ask permission. You can access this content digitally at sellingJesus.org
            img(src='https://copy.church/badges/sj_standard_pd.svg')

    div.toc(class='break')
        h3 Contents
        template(v-for='section of toc')
            h3 {{ section.title }}
            div(v-for='chapter of section.chapters')
                a.toc-chapter(@click='goto(chapter.id)' :href='"#" + chapter.id')
                    | {{ chapter.title }}

    div.preface(class='break')
        p Preface...

    div(class='profiles_html break' v-html='profiles_html')

    div.convos
        div(class="titles break")
            h2(id="chapter-convo-general") 2.&nbsp;&nbsp;Conversations about Selling Jesus
            div(class="author") Andrew Case

        div(v-html='convo_general.intro')
        InstantMessages(file_id='conversations' :topics='convo_general.topics' book)

        div(class="titles break")
            h2(id="chapter-convo-corinthians") 3.&nbsp;&nbsp;Conversations between Paul and the Corinthians
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
import {articles_by_category, article_ids} from '@/_comp/articles'
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


// Util to inline footnotes for an article
function inline_footnotes(article:string){
    const dom = new DOMParser().parseFromString(article, 'text/html')

    // Replace all refs with actual footnote contents
    dom.querySelectorAll('.footnote-ref').forEach(sup => {

        // Identify the <li> with the contents
        // WARN .href prepends "about:blank" for some reason
        const id = (sup.firstChild as HTMLAnchorElement).href.split('#')[1]
        const li = dom.querySelector('#' + id)
        if (!li){
            throw new Error("Couldn't get footnote contents")
        }

        // Create new <span> to hold contents with same attributes
        const new_span = dom.createElement('span')
        for (const attr of li.attributes){
            new_span.setAttribute(attr.name, attr.value)
        }

        // Footnotes have 1 or more <p> children so flatten and separate with <br> instead
        new_span.innerHTML = [...li.children].map(p => p.innerHTML).join('<br>')

        // Replace the ref and remove the <li>
        sup.replaceWith(new_span)
        li.remove()
    })

    // Ensure moved all footnotes
    // NOTE May not exist if no footnotes in article
    if (dom.querySelector('.footnotes-list')?.innerHTML.trim()){
        throw new Error("Didn't inline all footnotes")
    }

    // Remove old containers
    dom.querySelector('.footnotes-sep')?.remove()
    dom.querySelector('.footnotes')?.remove()

    // Return new html
    return dom.body.innerHTML
}


// Convert to object with ids
const articles = Object.fromEntries(articles_data.map(a => [a.url.split('/').pop(), a]))


// DEBUG List articles without a category
const no_cat = Object.keys(articles).filter(id => !article_ids.includes(id))
console.warn(`No category for articles: ${no_cat.join(', ')}`)


// Concat all by category
let articles_html = ''
let ch = 1 + 3
for (const category in articles_by_category){

    articles_html += `<div class='section break'><h1>${category}</h1></div>`

    for (const article_id of articles_by_category[category]){
        const article = articles[article_id]

        // Exclude if not public domain
        if (article.frontmatter.license){
            continue
        }

        // Add titles/etc before concating
        articles_html += '<div class="titles break">'
        const title = article.frontmatter.title_h1 || article.frontmatter.title
        const subtitle = article.frontmatter.title_h2
        articles_html += `<h2 id="chapter-${article_id}">${ch}.&nbsp;&nbsp;${title}</h2>`
        if (subtitle){
            articles_html += `<div class="subtitle">${subtitle}</div>`
        }
        articles_html += `<div class="author">${article.frontmatter.author}</div>`
        articles_html += '</div>'
        articles_html += inline_footnotes(demote_headings(article.html))
        ch++
        articles_html += `<div class='website'>An online version of this article, with links to sources, is available at:<br>https://sellingjesus.org/articles/${article_id}</div>`
    }
}


// Prepare profiles HTML
const profiles_title = `
    <div class="titles">
        <h2 id="chapter-profiles">1.&nbsp;&nbsp;Christians Who Sell Jesus</h2>
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
