import {IMsgBuilt} from '../utils/msgBuilder'

export interface IEventActionDict {
    [key:string]:{
        actionType:string,
        action:(options:any)=>any
    },
    [key:number]:{
        actionType:string,
        action:(options:any)=>any
    },
}

export interface ISolaceMessagePayload extends IMsgBuilt{
    sessionId: string;
    sessionName: string;
}
