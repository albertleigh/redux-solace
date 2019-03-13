import { initState } from '../init';

export interface IMsgBuilt {
    sessionEvent:any,
    attachment:any,
    destination:{
        type:string,
        name:string,
    },
    userDataStr:string,
    userPropertyMap:{[key:string]:string},
}

export function doBuildFromSdtMap(sdtMapContainer):any{
    const obj = {};
    const keys = sdtMapContainer?sdtMapContainer.getKeys():{};
    for (let key in keys) {
        switch (sdtMapContainer.getField(key).getType()) {
            case initState.solace.SDTFieldType.BOOL:
            case initState.solace.SDTFieldType.BYTEARRAY:
            case initState.solace.SDTFieldType.DESTINATION:
            case initState.solace.SDTFieldType.DOUBLETYPE:
            case initState.solace.SDTFieldType.FLOATTYPE:
            case initState.solace.SDTFieldType.INT8:
            case initState.solace.SDTFieldType.INT16:
            case initState.solace.SDTFieldType.INT32:
            case initState.solace.SDTFieldType.INT64:
            case initState.solace.SDTFieldType.NULLTYPE:
            case initState.solace.SDTFieldType.STRING:
            case initState.solace.SDTFieldType.UINT8:
            case initState.solace.SDTFieldType.UINT16:
            case initState.solace.SDTFieldType.UINT32:
            case initState.solace.SDTFieldType.WCHAR:
                obj[key] = sdtMapContainer.getField(key).getValue();
                break;
            case initState.solace.SDTFieldType.MAP:
                obj[key]=doBuildFromSdtMap(sdtMapContainer.getField(key).getValue());
                break;
        }
    }
    return obj;
}

export default (sessionEvent:any):IMsgBuilt=>{
    let attachment;

    const destination = sessionEvent.getDestination()?{
        type: sessionEvent.getDestination().getType(),
        name: sessionEvent.getDestination().getName(),
    }:null;
    const userDataStr = sessionEvent.getUserData()?sessionEvent.getUserData():null;
    const userPropertyMap={};

    const rawUserPropertyMap  = sessionEvent.getUserPropertyMap();

    if (rawUserPropertyMap){
        rawUserPropertyMap.getKeys().forEach((oneKey)=>{
            const oneField = rawUserPropertyMap.getField(oneKey);
            if (oneField.getType()==initState.solace.SDTFieldType.STRING){
                userPropertyMap[oneKey] = oneField.getValue();
            }
        })
    }

    if (sessionEvent.getType()==initState.solace.MessageType.BINARY){
        // json str payload
        try{
            attachment = JSON.parse(sessionEvent.getBinaryAttachment());
        }catch (e) {
            attachment = null;
        }
    }

    if (sessionEvent.getType()==initState.solace.MessageType.MAP){
        const container = sessionEvent.getSdtContainer();
        if (container.getType() == initState.solace.SDTFieldType.MAP){
            attachment = doBuildFromSdtMap(container.getValue())
        }else{
            attachment = container.getValue();
        }
    }

    return {
        sessionEvent, attachment, destination, userDataStr, userPropertyMap,
    }

}