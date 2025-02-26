
import {createContentLoader} from 'vitepress'


export default createContentLoader('articles/*.md', {
    transform(raw){
        // Sort as otherwise get hydration mismatch issues
        return raw.sort((a, b) => {
            const a_ms = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0
            const b_ms = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0
            return b_ms - a_ms
        })
    },
})
