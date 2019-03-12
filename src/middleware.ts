import {Store, Action, Middleware, MiddlewareAPI } from 'redux';
import { ActionHandlerParams } from './GlobalTypes';

// session
import {
    CREATE_AND_CONNECT_SESSION,
    DISCONNECT_AND_REMOVE_ONE_SESSION,
    CLOSE_AND_REMOVE_ALL_SESSIONS,
    SEND_CACHE_REQUEST_OF_ONE_SESSION,
} from './session/actions.constant';
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
} from './publishSubscribe/actions.constant';
import {
    publishOneTxtMsgToOneSessionHanlder,
    subscribeOneTopicOfOneSessionHanlder,
    unsubscribeOneTopicOfOneSessionHanlder,
} from './publishSubscribe/handlers'

import init from './init';

// request
import {
    SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION,
    REPLY_ONE_MSG_VIA_TXT_OF_ONE_SESSION,
} from './request/actions.constant'
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
    // request
    [SEND_ONE_TXT_MSG_REQUEST_OF_ONE_SESSION]:sendOneTxtMsgRequestOfOneSessionHanlder,
    [REPLY_ONE_MSG_VIA_TXT_OF_ONE_SESSION]:replyOneMsgViaTxtOfOneSessionHanlder,
};

export default ():Middleware => {

    return (store?:Store<any>)=>{

        init(store);

        return (next:Function)=>(action:Action)=>{
            const actionHandlerParams:ActionHandlerParams = {
                store, next, action,
                // solace:initState.solace,
                // solaceContext:initState.solaceContext,
            };

            const handler = actionHandlers[action.type];
            if (handler){
                handler(actionHandlerParams);
            }else{
                return next(action);
            }
        }

    };

}