import {Action} from 'redux-actions';

import { initState, dispatchAction } from '../init';
import { SessionContext } from '../utils/SolaceContext';
import msgBuilder from '../utils/msgBuilder';

import SolaceEvents from '../event';

import * as types from "./types";
import * as handlerActions from './handlerActions';

const SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION_ERR_MSG='[redux-solace] Failed to send txt msg of on session';
const REPLY_ONE_MSG_VIA_TXT_OF_ONE_SESSION_ERR_MSG='[redux-solace] Failed to reply the msg via txt';

export async function sendOneTxtMsgRequestOfOneSession(action:Action<types.ISendOneTxtMsgRequestOfOneSessionPayload>)
    :Promise<Action<types.ISendOneTxtMsgRequestOfOneSessionResPayload>>
{
    const {
        sessionId, topicName, msgText, userDataStr, deliverToOne, userPropertyMap,
        userObject, timeout,
    } = action.payload;

    return new Promise(((resolve, reject) => {
        initState.solaceContext.sendTxtMsgReqOfOneSession(
            sessionId, topicName, msgText, userDataStr, userPropertyMap,
            (session, message)=>{
                const {
                    attachment, destination, userDataStr, userPropertyMap
                } = msgBuilder(message);
                const responseAction = handlerActions.sendOneTxtMsgRequestOfOneSessionRes({
                    sessionId, topicName,
                    attachment, destination, userDataStr, userPropertyMap,
                    userObject, session, message,
                });
                dispatchAction(responseAction);
                resolve(responseAction);
            },
            (session, e)=>{
                const responseAction = handlerActions.sendOneTxtMsgRequestOfOneSessionRes({
                    sessionId, topicName,
                    userDataStr, userPropertyMap,
                    userObject, session,
                    name: SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION_ERR_MSG,
                    error:e
                });
                dispatchAction(responseAction);
                reject(e);
            },
            userObject, deliverToOne, timeout
        )
    }));
}

export async function replyOneMsgViaTxtOfOneSession(action:Action<types.IReplyOneMsgViaTxtOfOneSessionPayload>)
    :Promise<Action<types.IReplyOneMsgViaTxtOfOneSessionResPayload>>
{
    const {
        message, sessionId, msgText, userDataStr, userPropertyMap,
    } = action.payload;
    try{
        initState.solaceContext.replyOneMsgViaTxtOfOneSession(
            message, sessionId, msgText, userDataStr, userPropertyMap
        );
        const responseAction = handlerActions.replyOneMsgViaTxtOfOneSessionRes({});
        dispatchAction(responseAction);
        return responseAction;
    }catch (e) {
        console.error(e.message);
        dispatchAction(handlerActions.replyOneMsgViaTxtOfOneSessionRes({
            name:REPLY_ONE_MSG_VIA_TXT_OF_ONE_SESSION_ERR_MSG,
            error:e,
        }));
        throw  e;
    }

}