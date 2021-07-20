import {v1 as uuidv1} from 'uuid';

export default {
    insert(job, state) {
        return { _id: uuidv1() }
    },

    update(_id, data) {

    }
}