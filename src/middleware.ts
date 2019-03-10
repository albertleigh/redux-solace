import { ActionHandlerParams } from './GlobalTypes';

import { initState } from './init';

declare const window;

const actionHandlers = {

};

export default () => {

    return (store)=>(next)=>(action)=>{
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
    };

}