import {ActionHandlerParams} from "../GlobalTypes";
import * as asyncs from './async';

export const sendOneTxtMsgRequestOfOneSessionHanlder = (params:ActionHandlerParams)=>{
    const { action } = params;
    asyncs.sendOneTxtMsgRequestOfOneSession(action).catch( e=>{
        // eat the exception
    })
}

export const replyOneMsgViaTxtOfOneSessionHanlder = (params:ActionHandlerParams)=>{
    const { action } = params;
    asyncs.replyOneMsgViaTxtOfOneSession(action).catch( e=>{
        // eat the exception
    })
}