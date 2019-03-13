import { Store } from 'redux';
import { Action } from 'redux-actions';

export type ActionHandlerParams = {
    action:Action<any>,
    store:Store<any>,
    next:Function,
}