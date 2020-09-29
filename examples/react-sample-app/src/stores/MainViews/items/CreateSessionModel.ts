import {Model, MODEL_TYPE, Saga} from 'redux-anno';
import {Session} from 'redux-solace';
import {put} from 'redux-saga/effects'
import {MAIN_VIEW_TYPE, MainBaseView} from 'src/stores/MainViews/base';

import {NewSession} from 'src/components/sessions/NewSessionDialog'

@Model(MODEL_TYPE.PROTOTYPE)
export class CreateSessionModel extends MainBaseView {
  type = MAIN_VIEW_TYPE.CREATE_SESSION;

  constructor() {
    super(MAIN_VIEW_TYPE.CREATE_SESSION);
  }

  @Saga()
  * onConn(conn:NewSession){
    yield put(Session.actions.createAndConnectSession(conn))
  }

}
