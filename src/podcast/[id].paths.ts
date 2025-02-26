
import {episodes} from '../podcast.json'


export default {
    paths(){
        return episodes.map(item => ({params: item}))
    },
}
