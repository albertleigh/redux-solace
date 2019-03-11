import {Store, Action, Middleware, MiddlewareAPI } from 'redux';
import { ActionHandlerParams } from './GlobalTypes';

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

import init from './init';

declare const window;

const actionHandlers = {
    // session
    [CREATE_AND_CONNECT_SESSION]:createAndConnectSessionHandler,
    [DISCONNECT_AND_REMOVE_ONE_SESSION]:disconnectAndRemoveOneSessionHandler,
    [CLOSE_AND_REMOVE_ALL_SESSIONS]:closeAndRemoveAllSessionsHandler,
    [CLOSE_AND_REMOVE_ALL_SESSIONS]:closeAndRemoveAllSessionsHandler,
    [SEND_CACHE_REQUEST_OF_ONE_SESSION]:sendCacheRequestOfOneSessionHandler,
    // publish & subscribe
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