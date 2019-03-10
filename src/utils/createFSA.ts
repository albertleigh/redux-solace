import {createAction, ActionFunctionAny, Action} from 'redux-actions';

import noop from './noop';

export type ActionCreator<T> = ((options:T)=> Action<any>)

export default function createFSA<T>(type:string, payloadCreator:(payload:T)=>any):ActionCreator<T> {

    const actionCreator:ActionFunctionAny<Action<any>> = createAction(type,payloadCreator);

    return (payload:any) => {

        let oriPayload:Action<any> = actionCreator(payload);

        oriPayload.payload = oriPayload.payload?oriPayload.payload:{};

        // oriPayload.payload.callback = oriPayload.payload.callback?oriPayload.payload.callback:noop;
        // oriPayload.payload.errorCallback = oriPayload.payload.errorCallback?oriPayload.payload.errorCallback:noop;

        return <Action<any>> {
            ...oriPayload,
            error:payload && payload.name === 'Error',
        }

    }

}
