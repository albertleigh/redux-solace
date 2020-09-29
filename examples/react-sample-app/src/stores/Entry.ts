import {
  Action,
  createInstance,
  createState,
  Instance,
  Model,
  Reducer,
  createReducer,
  Saga,
  SAGA_TYPE,
  State
} from 'redux-anno';

import {Session,
  ICreateAndConnectSessionResPayload,
  IDisconnectAndRemoveOneSessionResPayload,
  ICloseAndRemoveAllSessionsResPayload,
} from 'redux-solace';
import {put, putResolve} from 'redux-saga/effects';
import {Color} from '@material-ui/lab/Alert'

import {MainViewManager} from 'src/stores/MainViews/MainViewManager';
import {SessionManager} from 'src/stores/solaces/SessionManager'
import {MessageManager} from 'src/stores/solaces/MessageManager'

interface State{
  snackBarOpen:boolean,
  snackBarMsg:string,
  snackBarColor: Color,
}

@Model()
export class Entry {

  @Instance mainVwMgr = createInstance(MainViewManager);
  @Instance solaceSessionMgr = createInstance(SessionManager);
  @Instance solaceMsgMgr = createInstance(MessageManager);

  @State snackBarOpen = createState<boolean>(false);
  @State snackBarMsg = createState<string>("");
  @State snackBarColor = createState<Color>("info");

  @Reducer
  setSnackBarMsg = createReducer((preState:State, payload:{message: string, color: Color})=>{
    return {
      ...preState,
      snackBarOpen: true,
      snackBarMsg: payload.message,
      snackBarColor: payload.color,
    }
  })

  @Reducer
  closeSnackBar = createReducer((preState:State)=>{
    return {
      ...preState,
      snackBarOpen: false,
    }
  })

  @Saga(SAGA_TYPE.TAKE_EVERY, Session.actions.CREATE_AND_CONNECT_SESSION_RES)
  *onSessionCreatedRes(act:Action<ICreateAndConnectSessionResPayload>){
    const payload = act.payload!;
    if (payload && payload.result?.name){
      yield putResolve(this.closeSnackBar.create());
      if (payload.error){
        yield put(this.setSnackBarMsg.create({
          message: `Failed to create ${payload.result?.name}`,
          color: "error"
        }))
      }else {
        yield put(this.setSnackBarMsg.create({
          message: `Successfully created ${payload.result?.name}`,
          color: "success"
        }))
      }
    }
  }

  @Saga(SAGA_TYPE.TAKE_EVERY, Session.actions.DISCONNECT_AND_REMOVE_ONE_SESSION_RES)
  *onOneSessionRemoved(act:Action<IDisconnectAndRemoveOneSessionResPayload>){
    const payload = act.payload!;
    yield putResolve(this.closeSnackBar.create());
    if (!!(act as any).error){
      yield put(this.setSnackBarMsg.create({
        message: `Failed to close the session`,
        color: "error"
      }))
    }else {
      yield put(this.setSnackBarMsg.create({
        message: `Successfully remove ${payload.result} session`,
        color: "success"
      }))
    }
  }

  @Saga(SAGA_TYPE.TAKE_EVERY, Session.actions.CLOSE_AND_REMOVE_ALL_SESSIONS_RES)
  *onAllSessionRemoved(act:Action<ICloseAndRemoveAllSessionsResPayload>){
    const payload = act.payload!;
    yield putResolve(this.closeSnackBar.create());
    if (!!(act as any).error || !payload.result){
      yield put(this.setSnackBarMsg.create({
        message: `Failed to close the session`,
        color: "error"
      }))
    }else {
      const theSubMsg = payload.result > 1 ? `${payload.result} sessions` : `one session`
      yield put(this.setSnackBarMsg.create({
        message: `Successfully remove ${theSubMsg}`,
        color: "success"
      }))
    }
  }

}

export default Entry;
