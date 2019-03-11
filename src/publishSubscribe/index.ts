import * as actionTypes from './types'
import * as actions from './actions'
import * as asyncs from './async';

export default {
    actions:{
        ...actionTypes,
        ...actions,
    },
    asyncs
}