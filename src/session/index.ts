import * as actionTypes from './types'
import * as actions from './actions'

export default {
    actions:{
        ...actionTypes,
        ...actions,
    }
}