import {Action} from 'redux-actions';

import { initState, dispatchAction } from '../init';
import { SessionContext } from '../utils/SolaceContext';
import msgBuilder, {IMsgBuilt} from '../utils/msgBuilder';

import * as types from "./types";
import * as handlerActions from './handlerActions';

const PUBLISH_ONE_TXT_MSG_TO_ONE_SESSION_ERR_MSG='[redux-solace] Failed to publish the txt msg to a session';
const SUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION_ERR_MSG='[redux-solace] Failed to subscribe one topic of one solace session';
const UNSUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION_ERR_MSG='[redux-solace] Failed to unsubscribe one topic of one solace session';


export async function publishOneTxtMsgToOneSession(action:Action<types.IPublishOneTxtMsgToOneSessionPayload>)
    :Promise<Action<types.IPublishOneTxtMsgToOneSessionResPayload>>
{
    const {
        sessionId, topicName, msgText, userDataStr, userPropertyMap,
    } = action.payload;


    try{
        initState.solaceContext.publishOneTxtMsgOfOneSession(
            sessionId, topicName, msgText,
            userDataStr?userDataStr:"", userPropertyMap?userPropertyMap:{}
        );
        const responoseAction = handlerActions.publishOneTxtMsgToOneSessionRes({});
        dispatchAction(responoseAction);
        return responoseAction;

    }catch (e) {
        console.error(e.message);
        dispatchAction(handlerActions.publishOneTxtMsgToOneSessionRes({
            name:PUBLISH_ONE_TXT_MSG_TO_ONE_SESSION_ERR_MSG,
            error:e,
        }));
        throw  e;
    }
}

export async function subscribeOneTopicOfOneSession(action:Action<types.ISubscribeOneTopicOfOneSessionPayload>)
    :Promise<Action<types.ISubscribeOneTopicOfOneSessionResPayload>>
{
    const {
        sessionId, topicName, timeout,
    } = action.payload;


    try{
        initState.solaceContext.subscribeOneTopicOfOneSession(
            sessionId, topicName, timeout
        );
        const responoseAction = handlerActions.subscribeOneTopicOfOneSessionRes({});
        dispatchAction(responoseAction);
        return responoseAction;

    }catch (e) {
        console.error(e.message);
        dispatchAction(handlerActions.subscribeOneTopicOfOneSessionRes({
            name:SUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION_ERR_MSG,
            error:e,
        }));
        throw  e;
    }
}

export async function unsubscribeOneTopicOfOneSession(action:Action<types.IUnsubscribeOneTopicOfOneSessionPayload>)
    :Promise<Action<types.IUnsubscribeOneTopicOfOneSessionResPayload>>
{
    const {
        sessionId, topicName, timeout,
    } = action.payload;


    try{
        initState.solaceContext.unsubscribeOneTopicOfOneSession(
            sessionId, topicName, timeout
        );
        const responoseAction = handlerActions.unsubscribeOneTopicOfOneSessionRes({});
        dispatchAction(responoseAction);
        return responoseAction;

    }catch (e) {
        console.error(e.message);
        dispatchAction(handlerActions.unsubscribeOneTopicOfOneSessionRes({
            name:UNSUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION_ERR_MSG,
            error:e,
        }));
        throw  e;
    }
}