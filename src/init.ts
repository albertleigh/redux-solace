import solace from 'solclientjs/lib-browser/solclient';

import SolaceContext from './utils/SolaceContext';

declare const window;

export interface IInitState {
    solace:any,
    solaceContext:SolaceContext,
}

export const initState:IInitState = {
    solace: solace,
    solaceContext: null,
};

function init() {
    initState.solaceContext = new SolaceContext(solace);
    window.solace = solace;
    window.solaceContext = initState.solaceContext;
}

export default init;