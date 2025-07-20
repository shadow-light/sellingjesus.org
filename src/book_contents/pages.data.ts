
import {createContentLoader} from 'vitepress'


// WARN These will be sorted alphabetically regardless of input order
export default createContentLoader(['book/conclusion.md', 'book/foreword.md', 'book/intro.md', 'learn/profiles.md'], {
    render: true,
})
