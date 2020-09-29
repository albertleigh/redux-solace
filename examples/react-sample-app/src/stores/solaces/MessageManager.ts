import {Model, Saga, SAGA_TYPE, Action} from 'redux-anno';
import {Event, solace, ISolaceMessagePayload} from "redux-solace";

const MAXIMUM_MESSAGES  = 1e3;

export interface InnerSolaceMessage{
  sessionId:string;
  sessionName:string;
  binaryAttachment:string
  attachment:any;
  destination?:{
    type:string;
    name:string;
  }
  ctime:Date;
}

export function buildInnerSolaceMessage(payload:ISolaceMessagePayload):InnerSolaceMessage{
  return ({
    sessionId: payload.sessionId,
    sessionName: payload.sessionName,
    binaryAttachment: payload.sessionEvent.getBinaryAttachment(),
    attachment: payload.attachment,
    destination: payload.destination,
    ctime: new Date()
  })
}

@Model()
export class MessageManager{

  messages:InnerSolaceMessage[] = [];

  @Saga(SAGA_TYPE.TAKE_EVERY, Event.actionsDict[solace.SessionEventCode.MESSAGE].actionType)
  *onSolaceMessage(act:Action<ISolaceMessagePayload>){
    this.messages.push(buildInnerSolaceMessage(act.payload!))

    while (this.messages.length > MAXIMUM_MESSAGES){
      this.messages.shift();
    }

  }

}
