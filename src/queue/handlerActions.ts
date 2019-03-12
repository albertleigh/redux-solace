import { Action } from 'redux-actions';
import createFSA, { ActionCreator } from '../utils/createFSA';

import * as types from './types';
import * as actionTypes from './actions.constant';

export const sendOneTxtMsgToQueueOfOneSessionRes:ActionCreator<types.ISendOneTxtMsgToQueueOfOneSessionResPayload> =
    createFSA<types.ISendOneTxtMsgToQueueOfOneSessionResPayload>(
        actionTypes.SEND_ONE_TXT_MSG_TO_QUEUE_OF_ONE_SESSION_RES,
        (options:types.ISendOneTxtMsgToQueueOfOneSessionResPayload) => <any> options
    );


export const consumeFromQueueOfOneSessionRes:ActionCreator<types.IConsumeFromQueueOfOneSessionResPayload> =
    createFSA<types.IConsumeFromQueueOfOneSessionResPayload>(
        actionTypes.CONSUME_FROM_QUEUE_OF_ONE_SESSION_RES,
        (options:types.IConsumeFromQueueOfOneSessionResPayload) => <any> options
    );
