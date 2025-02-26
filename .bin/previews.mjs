
import {join} from 'path'
import {readdirSync, readFileSync, writeFileSync} from 'fs'

import {JSDOM} from 'jsdom'
import {escape} from 'html-escaper'


export function generate_previews_page(dist){
    // Generate a HTML page with previews for all the site's pages

    // Form html output
    let output = ''

    // Recursive function for processing html files
    const read_dir = (dir) => {
        readdirSync(dir, {withFileTypes: true, encoding: 'utf8'}).forEach(item => {

            // Get the item's full path
            const item_path = join(dir, item.name)

            // Recurse through dirs
            if (item.isDirectory()){
                read_dir(item_path)
            } else if (item_path.endsWith('.html') && !item_path.endsWith('_previews.html')){

                // Parse html
                const dom = new JSDOM(readFileSync(item_path, 'utf-8'))

                // Extract meta data
                const title = dom.window.document.querySelector('title')?.textContent ?? ''
                const desc = dom.window.document.querySelector('meta[name="description"]')?.attributes.getNamedItem('content')?.value ?? ''
                const image = dom.window.document.querySelector('meta[property="og:image"]')?.attributes.getNamedItem('content')?.value ?? ''

                // Add to output
                output += `
                    <div>
                        <h2>${escape(item_path.slice(dist.length, -5))}</h2>
                        <h3>${escape(title)}</h3>
                        <p>${escape(desc)}</p>
                        <div style="background-image: url(${escape(image)})"></div>
                        <hr>
                    </div>
                `
            }
        })
    }

    // Read the dist dir
    read_dir(dist)

    // Finish html structure
    output = `<!DOCTYPE html>
        <html>
            <head>
                <style>
                    body > div {max-width: 400px;}
                    div > div {background-position: center; background-size: cover; aspect-ratio: 1200 / 630;}
                    img {width: 100%;}
                </style>
            </head>
            <body>${output}</body>
        </html>
    `

    // Write previews page to the dist dir
    writeFileSync(join(dist, '_previews.html'), output)
}


// Execute for dist dir
generate_previews_page('dist')
