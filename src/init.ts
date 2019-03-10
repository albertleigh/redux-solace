import {Store } from 'redux';
import solace from 'solclientjs/lib-browser/solclient';

import SolaceContext from './utils/SolaceContext';

declare const window;

export interface IInitState {
    store?:Store<any>,
    solace:any,
    solaceContext:SolaceContext,
}

export const initState:IInitState = {
    store:null,
    solace: solace,
    solaceContext: new SolaceContext(solace),
};

window.solace = solace;
window.solaceContext = initState.solaceContext;

function init(store?:Store<any>) {
    if (store){
        initState.store = store;
    }
}

export default init;