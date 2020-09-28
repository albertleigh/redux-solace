import {Store, Action } from 'redux';
import { ActionHandlerParams } from './GlobalTypes';

// session
import {
    CREATE_AND_CONNECT_SESSION,
    DISCONNECT_AND_REMOVE_ONE_SESSION,
    CLOSE_AND_REMOVE_ALL_SESSIONS,
    SEND_CACHE_REQUEST_OF_ONE_SESSION,
} from './session/actions';
import {
    createAndConnectSessionHandler,
    disconnectAndRemoveOneSessionHandler,
    closeAndRemoveAllSessionsHandler,
    sendCacheRequestOfOneSessionHandler,
} from './session/handlers';

// publish & subscribe
import {
    PUBLISH_ONE_TXT_MSG_TO_ONE_SESSION,
    SUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION,
    UNSUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION,
} from './publishSubscribe/actions';
import {
    publishOneTxtMsgToOneSessionHanlder,
    subscribeOneTopicOfOneSessionHanlder,
    unsubscribeOneTopicOfOneSessionHanlder,
} from './publishSubscribe/handlers'

import init from './init';

// queue
import {
    SEND_ONE_TXT_MSG_TO_QUEUE_OF_ONE_SESSION,
    CONSUME_FROM_QUEUE_OF_ONE_SESSION
} from './queue/actions';
import {
    sendOneTxtMsgToQueueOfOneSessionHanlder,
    consumeFromQueueOfOneSessionHanlder,
} from './queue/handlers';

// request
import {
    SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION,
    REPLY_ONE_MSG_VIA_TXT_OF_ONE_SESSION,
} from './request/actions'
import {
    sendOneTxtMsgRequestOfOneSessionHanlder,
    replyOneMsgViaTxtOfOneSessionHanlder,
} from './request/handlers'

declare const window;

const actionHandlers = {
    // session
    [CREATE_AND_CONNECT_SESSION]:createAndConnectSessionHandler,
    [DISCONNECT_AND_REMOVE_ONE_SESSION]:disconnectAndRemoveOneSessionHandler,
    [CLOSE_AND_REMOVE_ALL_SESSIONS]:closeAndRemoveAllSessionsHandler,
    [CLOSE_AND_REMOVE_ALL_SESSIONS]:closeAndRemoveAllSessionsHandler,
    [SEND_CACHE_REQUEST_OF_ONE_SESSION]:sendCacheRequestOfOneSessionHandler,
    // publish & subscribe
    [PUBLISH_ONE_TXT_MSG_TO_ONE_SESSION]:publishOneTxtMsgToOneSessionHanlder,
    [SUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION]:subscribeOneTopicOfOneSessionHanlder,
    [UNSUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION]:unsubscribeOneTopicOfOneSessionHanlder,
    // queue
    [SEND_ONE_TXT_MSG_TO_QUEUE_OF_ONE_SESSION]:sendOneTxtMsgToQueueOfOneSessionHanlder,
    [CONSUME_FROM_QUEUE_OF_ONE_SESSION]:consumeFromQueueOfOneSessionHanlder,
    // request
    [SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION]:sendOneTxtMsgRequestOfOneSessionHanlder,
    [REPLY_ONE_MSG_VIA_TXT_OF_ONE_SESSION]:replyOneMsgViaTxtOfOneSessionHanlder,
};

export default () => {

    return (store?:Store<any>)=>{

        init(store);

        return (next:Function)=>(action:Action)=>{
            const actionHandlerParams:ActionHandlerParams = {
                store, next, action,
                // solace:initState.solace,
                // solaceContext:initState.solaceContext,
            } as any;

            const handler = actionHandlers[action.type];
            if (handler){
                handler(actionHandlerParams);
            }else{
                return next(action);
            }
        }

    };

}
