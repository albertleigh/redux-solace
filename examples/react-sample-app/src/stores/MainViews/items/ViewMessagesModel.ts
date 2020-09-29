import {MAIN_VIEW_TYPE, MainBaseView} from 'src/stores/MainViews/base';
import {
  createState,
  Model,
  MODEL_TYPE,
  State,
  Saga,
  Action,
  SAGA_TYPE,
  Instance,
  createInstance
} from 'redux-anno';
import {putResolve, takeEvery} from 'redux-saga/effects';
import {GridReadyEvent} from "ag-grid-community/dist/lib/events";
import {GridApi} from "ag-grid-community/dist/lib/gridApi";
import {ColumnApi} from "ag-grid-community/dist/lib/columnController/columnApi";
import {Event, solace} from "redux-solace";

import {MessageManager, InnerSolaceMessage, buildInnerSolaceMessage} from 'src/stores/solaces/MessageManager'

@Model(MODEL_TYPE.PROTOTYPE)
export class ViewMessagesModel extends MainBaseView {
  type = MAIN_VIEW_TYPE.VIEW_MESSAGES;

  @Instance solaceMsgMgr = createInstance(MessageManager);
  @State gridReady = createState(false as boolean);

  api?: GridApi;
  columnApi?: ColumnApi;

  constructor() {
    super(MAIN_VIEW_TYPE.VIEW_MESSAGES);
  }

  * onPreLeave(){
    this.api = undefined;
    this.columnApi = undefined;
    yield putResolve(this.gridReady.create(true));
  }

  @Saga()
  * onGridReady(event: GridReadyEvent){
    this.api = event.api
    this.columnApi = event.columnApi;
    this.api.setRowData(this.solaceMsgMgr.messages);
    yield putResolve(this.gridReady.create(true));
  }

  *onSolaceMessage(act:Action){
    if (!!this.api){
      this.api.applyTransaction({ add: [buildInnerSolaceMessage(act.payload!)]})
    }
  }

  @Saga(SAGA_TYPE.AUTO_RUN)
  *entry(){
    yield takeEvery(Event.actionsDict[solace.SessionEventCode.MESSAGE].actionType, this.onSolaceMessage.bind(this));
  }

}
