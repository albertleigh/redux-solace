import {Action} from 'redux-actions';

import { initState, dispatchAction } from '../init';
import { SessionContext } from '../utils/SolaceContext';
import msgBuilder, {IMsgBuilt} from '../utils/msgBuilder';

import SolaceEvents from '../event';

import * as types from "./types";
import * as handlerActions from './handlerActions';

const CREATE_SESSION_ERR_MSG='[redux-solace] Failed to create solace session';
const CLOSE_SESSION_ERR_MSG='[redux-solace] Failed to close one solace session';
const CLOSE_ALL_SESSION_ERR_MSG='[redux-solace] Failed to close all solace session';
const SEND_CACHE_REQUEST_OF_ONE_SESSION_ERR_MSG='[redux-solace] Failed to send cache request of one session';

export async function createAndConnectSession(action:Action<types.ICreateAndConnectSessionPayload>)
    :Promise<Action<types.ICreateAndConnectSessionResPayload>>
{
    const {
        hostUrl, vpn, username, sessionCache, pass, config
    } = action.payload;

    let newSessionContext:SessionContext = null;
    try{
        newSessionContext = initState.solaceContext.createAndConnectSession(
            hostUrl,username,pass, vpn, sessionCache, {}, config
        );
    }catch (e) {
        console.error(e.message)
        dispatchAction(handlerActions.createAndConnectSessionRes({
            name:CREATE_SESSION_ERR_MSG,
            error:e,
        }));
    }finally {
        dispatchAction(handlerActions.solaceContextChanged(initState.solaceContext.getContextPayload()))
    }

    if(newSessionContext){
        const sessionId = newSessionContext.id;
        const solaceSessionEventDict = SolaceEvents.actionsDict;
        const responseAction = handlerActions.createAndConnectSessionRes({result:newSessionContext});
        Object.keys(solaceSessionEventDict).forEach(oneEvtCode => {
            if (oneEvtCode === initState.solace.SessionEventCode.MESSAGE){
                initState.solaceContext.addOneToEventHookOfOneSession(sessionId,oneEvtCode,(sessionEvent)=>{
                    const msgBuilt:IMsgBuilt = msgBuilder(sessionEvent);
                    dispatchAction(solaceSessionEventDict[oneEvtCode].action({
                        sessionId, ...msgBuilt,
                    }));
                })

            }else{
                initState.solaceContext.addOneToEventHookOfOneSession(sessionId,oneEvtCode,(sessionEvent)=>{
                    dispatchAction(solaceSessionEventDict[oneEvtCode].action({sessionId,sessionEvent}));
                })
            }
        });
        dispatchAction(responseAction);
        return responseAction;
    }else{
        throw CREATE_SESSION_ERR_MSG;
    }
}