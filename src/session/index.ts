import * as actionTypes from './types'
import * as actionsCreators from './actions'
import * as asyncsRefs from './async';


export const actions = {
    ...actionTypes,
    ...actionsCreators,
};

export const asyncs = asyncsRefs;

export default {
    actions,
    asyncs,
}