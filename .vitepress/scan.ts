
import path from 'path'
import {readdirSync, readFileSync, existsSync} from 'fs'

import matter from 'gray-matter'


interface NavItem {
    text:string
    link:string
}


const src_dir = path.join(__dirname, '../src')


export function scan_dir(dir:string){
    // Scan a dir of markdown files and return list of the frontmatter

    // Resolve dir relative to src dir
    const absolute_dir = path.join(src_dir, dir)

    if (!existsSync(absolute_dir)){
        return []
    }

    return readdirSync(absolute_dir).filter(filename => filename.endsWith('.md')).map(filename => {
        const fm = matter(readFileSync(path.join(absolute_dir, filename), 'utf-8')).data
        fm._url = path.posix.join('/', dir, filename.slice(0, '.md'.length * -1))
        return fm
    })
}


export function scan_dir_nav(dir:string):NavItem[]{
    // Return nav items for markdown files in dir
    return scan_dir(dir).map(frontmatter => {
        return {
            link: frontmatter._url,
            text: frontmatter.title,
        }
    })
}
