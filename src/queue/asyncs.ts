import {Action} from 'redux-actions';

import { initState, dispatchAction } from '../init';
import msgBuilder, {IMsgBuilt} from '../utils/msgBuilder';

import { actionsDict as EventActions } from '../event'

import * as types from "./types";
import * as handlerActions from './handlerActions';

const SEND_ONE_TXT_MSG_TO_QUEUE_OF_ONE_SESSION_ERR_MSG='[redux-solace] Failed to send one txt msg to queue of one session';
const CONSUME_FROM_QUEUE_OF_ONE_SESSION_ERR_MSG='[redux-solace] Failed to consume from queue of one session';


export async function sendOneTxtMsgToQueueOfOneSession(action:Action<types.ISendOneTxtMsgToQueueOfOneSessionPayload>)
    :Promise<Action<types.ISendOneTxtMsgToQueueOfOneSessionResPayload>>
{
    const {
        sessionId, queueName, msgTxt, userDataStr, userPropertyMap, correlationKey
    } = action.payload;

    try{
        initState.solaceContext.sendOneTxtMsgToQueueOfOneSession(
            sessionId, queueName, msgTxt, userDataStr, userPropertyMap, correlationKey,
        );
        const responoseAction = handlerActions.sendOneTxtMsgToQueueOfOneSessionRes({
            sessionId, queueName, msgTxt, userDataStr, userPropertyMap, correlationKey,
        });
        dispatchAction(responoseAction);
        return responoseAction;
    }catch (e) {
        console.error(e.message);
        dispatchAction(handlerActions.sendOneTxtMsgToQueueOfOneSessionRes({
            name:SEND_ONE_TXT_MSG_TO_QUEUE_OF_ONE_SESSION_ERR_MSG,
            error:e,
        }));
        throw  e;
    }

}

export async function consumeFromQueueOfOneSession(action:Action<types.IConsumeFromQueueOfOneSessionPayload>)
    :Promise<Action<types.IConsumeFromQueueOfOneSessionResPayload>>
{
    const {
        sessionId, queueName, autoAcknowledge, otherCallbackDict,
    } = action.payload;

    const onMsgCb = (sessionEvent)=>{
        const result = msgBuilder(sessionEvent);
        dispatchAction(
            EventActions[initState.solace.MessageConsumerEventName.MESSAGE]
                .action({
                    sessionId, queueName,
                    ...result,
                })
        )
    };

    const wrappedCbDict:{[key:number]:Function,[key:string]:Function} ={};

    initState.solaceContext.messageConsumerEventCodes.forEach((oneEventCode)=>{
        if (oneEventCode !== initState.solace.MessageConsumerEventName.MESSAGE){
            if (otherCallbackDict && otherCallbackDict[oneEventCode]){
                wrappedCbDict[oneEventCode] = function () {
                    dispatchAction(EventActions[oneEventCode].action({
                        sessionId, queueName, arguments
                    }));
                    return otherCallbackDict[oneEventCode]();
                }
            }else{
                wrappedCbDict[oneEventCode] = function () {
                    dispatchAction(EventActions[oneEventCode].action({
                        sessionId, queueName, arguments
                    }));
                }
            }
        }
    });

    try{
        initState.solaceContext.consumeFromQueueOfOneSession(
            sessionId, queueName, onMsgCb, autoAcknowledge, wrappedCbDict,
        );
        const responoseAction = handlerActions.consumeFromQueueOfOneSessionRes({
            sessionId, queueName
        });
        dispatchAction(responoseAction);
        return responoseAction;
    }catch (e) {
        console.error(e.message);
        dispatchAction(handlerActions.consumeFromQueueOfOneSessionRes({
            name:CONSUME_FROM_QUEUE_OF_ONE_SESSION_ERR_MSG,
            error:e,
        }));
        throw  e;
    }

}
