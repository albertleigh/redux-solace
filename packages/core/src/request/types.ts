import { BaseRequestPayload, BaseResponsePayload } from '../base/BasePayload';

export interface ISendOneTxtMsgRequestOfOneSessionPayload extends BaseRequestPayload{
    sessionId:string,
    topicName:string,
    msgText:string,
    userPropertyMap:any,
    userDataStr?:string,
    deliverToOne?:boolean,
    userObject?:any,
    timeout?:number,
}
export interface ISendOneTxtMsgRequestOfOneSessionResPayload extends BaseResponsePayload{
    sessionId?:string,
    topicName?:string,
    attachment?:any,
    destination?:{
        type:string,
        name:string,
    },
    userDataStr?:string,
    userPropertyMap?:{[key:string]:string},
    userObject?:any,
    session?:any,
    message?:any,
    msgText?:string,
    event?:any,
}

export interface IReplyOneMsgViaTxtOfOneSessionPayload extends BaseRequestPayload{
    message:any,
    sessionId:string,
    msgText?:string,
    userDataStr?:string,
    userPropertyMap?:any,
}
export interface IReplyOneMsgViaTxtOfOneSessionResPayload extends BaseResponsePayload{

}