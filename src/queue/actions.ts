import { Action } from 'redux-actions';
import createFSA, { ActionCreator } from '../utils/createFSA';

import * as types from './types';
import * as actionTypes from './actions.constant';

export const sendOneTxtMsgToQueueOfOneSession:ActionCreator<types.ISendOneTxtMsgToQueueOfOneSessionPayload> =
    createFSA<types.ISendOneTxtMsgToQueueOfOneSessionPayload>(
        actionTypes.SEND_ONE_TXT_MSG_TO_QUEUE_OF_ONE_SESSION,
        (options:types.ISendOneTxtMsgToQueueOfOneSessionPayload) => <any> options
    );


export const consumeFromQueueOfOneSession:ActionCreator<types.IConsumeFromQueueOfOneSessionPayload> =
    createFSA<types.IConsumeFromQueueOfOneSessionPayload>(
        actionTypes.CONSUME_FROM_QUEUE_OF_ONE_SESSION,
        (options:types.IConsumeFromQueueOfOneSessionPayload) => <any> options
    );
