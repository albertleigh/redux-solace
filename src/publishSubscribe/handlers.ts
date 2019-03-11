import {ActionHandlerParams} from "../GlobalTypes";
import * as asyncs from './async';

export const publishOneTxtMsgToOneSessionHanlder = (params:ActionHandlerParams)=>{
    const { action } = params;
    asyncs.publishOneTxtMsgToOneSession(action).catch( e=>{
        // eat the exception
    })
}

export const subscribeOneTopicOfOneSessionHanlder = (params:ActionHandlerParams)=>{
    const { action } = params;
    asyncs.subscribeOneTopicOfOneSession(action).catch( e=>{
        // eat the exception
    })
}

export const unsubscribeOneTopicOfOneSessionHanlder = (params:ActionHandlerParams)=>{
    const { action } = params;
    asyncs.unsubscribeOneTopicOfOneSession(action).catch( e=>{
        // eat the exception
    })
}
