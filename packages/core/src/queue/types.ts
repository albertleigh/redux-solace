import { BaseRequestPayload, BaseResponsePayload } from '../base/BasePayload';

export interface ISendOneTxtMsgToQueueOfOneSessionPayload extends BaseRequestPayload{
    sessionId:string,
    queueName:string,
    msgTxt:string,
    userDataStr?:string,
    userPropertyMap?:any,
    correlationKey?:any,
}
export interface ISendOneTxtMsgToQueueOfOneSessionResPayload extends BaseResponsePayload{
    sessionId?:string,
    queueName?:string,
    msgTxt?:string,
    userDataStr?:string,
    userPropertyMap?:any,
    correlationKey?:any,
}

export interface IConsumeFromQueueOfOneSessionPayload extends BaseRequestPayload{
    sessionId:string,
    queueName:string,
    autoAcknowledge?:boolean,
    otherCallbackDict?:{[key:number]:Function,[key:string]:Function},
}
export interface IConsumeFromQueueOfOneSessionResPayload extends BaseResponsePayload{
    sessionId?:string,
    queueName?:string,
}