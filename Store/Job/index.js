import {v1 as uuidv1} from 'uuid';

export default {
    insert(type, schedule, callback, state) {
        return { _id: uuidv1() }
    },

    update(_id, data) {

    }
}