// Render resources json values to HTML

import {writeFileSync} from 'fs'

import MarkdownIt from 'markdown-it'

import data from '../src/learn/resources.json' with {type: 'json'}


const markdowner = new MarkdownIt({linkify: true, typographer: true, html: true})

for (const cat of data.categories){
    for (const resource of cat.resources){
        resource.description = markdowner.render(resource.description)
    }
}

writeFileSync('src/learn/resources_processed.json', JSON.stringify(data), {encoding: 'utf8'})
