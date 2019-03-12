import {ActionHandlerParams} from "../GlobalTypes";
import * as asyncs from './async';

export const sendOneTxtMsgToQueueOfOneSessionHanlder = (params:ActionHandlerParams)=>{
    const { action } = params;
    asyncs.sendOneTxtMsgToQueueOfOneSession(action).catch( e=>{
        // eat the exception
    })
}

export const consumeFromQueueOfOneSessionHanlder = (params:ActionHandlerParams)=>{
    const { action } = params;
    asyncs.consumeFromQueueOfOneSession(action).catch( e=>{
        // eat the exception
    })
}