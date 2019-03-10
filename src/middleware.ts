import {Store, Action, Middleware, MiddlewareAPI } from 'redux';
import { ActionHandlerParams } from './GlobalTypes';

import init from './init';

declare const window;

const actionHandlers = {

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