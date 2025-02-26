
import items from '../../videos_doc.json'


export default {
    paths(){
        return items.map(item => ({params: item}))
    },
}
