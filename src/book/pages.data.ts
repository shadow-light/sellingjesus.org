
import {createContentLoader} from 'vitepress'


export default createContentLoader(['book/intro.md', 'learn/profiles.md'], {
    render: true,
})
