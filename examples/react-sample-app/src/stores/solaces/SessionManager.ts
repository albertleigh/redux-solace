import {Model, Saga, SAGA_TYPE, Self, createSelf, State, createState, Reducer, createReducer, Action} from 'redux-anno';
import { putResolve, takeLatest} from 'redux-saga/effects';
import {
  Session, ISolaceContextChangedEventPayload
} from 'redux-solace'

interface State{
  total: number;
  defaultSessionId: string;
  sessionContexts: ISolaceContextChangedEventPayload['sessionContexts'];
}

@Model()
export class SessionManager{

  @State total = createState<number>(0);
  @State defaultSessionId = createState<string>('');
  @State sessionContexts = createState<ISolaceContextChangedEventPayload['sessionContexts']>([]);

  @Reducer
  reduceSolaceContextChangedEvent = createReducer((previousState: State, payload: ISolaceContextChangedEventPayload) => {
    return {
      ...previousState,
      total: payload.total,
      defaultSessionId: payload.defaultSessionId,
      sessionContexts: payload.sessionContexts,
    };
  });

  @Saga(SAGA_TYPE.TAKE_LATEST, Session.actions.SOLACE_CONTEXT_CHANGED)
  *solaceCtxChanged(act:Action<ISolaceContextChangedEventPayload>){
    yield putResolve(this.reduceSolaceContextChangedEvent.create(act.payload!));
  }

}
