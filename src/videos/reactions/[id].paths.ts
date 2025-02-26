
import items from '../../videos_reactions.json'


export default {
    paths(){
        return items.map(item => ({params: item}))
    },
}
