import { Action } from 'redux-actions';
import makeType from '../utils/makeType';
import createFSA, { ActionCreator } from '../utils/createFSA';
import * as types from './types';

export const SEND_ONE_TXT_MSG_TO_QUEUE_OF_ONE_SESSION = makeType('SEND_ONE_TXT_MSG_TO_QUEUE_OF_ONE_SESSION');
export const SEND_ONE_TXT_MSG_TO_QUEUE_OF_ONE_SESSION_RES = makeType('SEND_ONE_TXT_MSG_TO_QUEUE_OF_ONE_SESSION_RES');

export const CONSUME_FROM_QUEUE_OF_ONE_SESSION = makeType('CONSUME_FROM_QUEUE_OF_ONE_SESSION');
export const CONSUME_FROM_QUEUE_OF_ONE_SESSION_RES = makeType('CONSUME_FROM_QUEUE_OF_ONE_SESSION_RES');


export const sendOneTxtMsgToQueueOfOneSession:ActionCreator<types.ISendOneTxtMsgToQueueOfOneSessionPayload> =
    createFSA<types.ISendOneTxtMsgToQueueOfOneSessionPayload>(
        SEND_ONE_TXT_MSG_TO_QUEUE_OF_ONE_SESSION,
        (options:types.ISendOneTxtMsgToQueueOfOneSessionPayload) => <any> options
    );


export const consumeFromQueueOfOneSession:ActionCreator<types.IConsumeFromQueueOfOneSessionPayload> =
    createFSA<types.IConsumeFromQueueOfOneSessionPayload>(
        CONSUME_FROM_QUEUE_OF_ONE_SESSION,
        (options:types.IConsumeFromQueueOfOneSessionPayload) => <any> options
    );
