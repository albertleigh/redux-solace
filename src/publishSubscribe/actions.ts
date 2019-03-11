import { Action } from 'redux-actions';
import createFSA, { ActionCreator } from '../utils/createFSA';

import * as types from './types';
import * as actionTypes from './actions.constant';

export const publishOneTxtMsgToOneSession:ActionCreator<types.IPublishOneTxtMsgToOneSessionPayload> =
    createFSA<types.IPublishOneTxtMsgToOneSessionPayload>(
        actionTypes.PUBLISH_ONE_TXT_MSG_TO_ONE_SESSION,
        (options:types.IPublishOneTxtMsgToOneSessionPayload) => <any> options
    );

export const subscribeOneTopicOfOneSession:ActionCreator<types.ISubscribeOneTopicOfOneSessionPayload> =
    createFSA<types.ISubscribeOneTopicOfOneSessionPayload>(
        actionTypes.SUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION,
        (options:types.ISubscribeOneTopicOfOneSessionPayload) => <any> options
    );

export const unsubscribeOneTopicOfOneSession:ActionCreator<types.IUnsubscribeOneTopicOfOneSessionPayload> =
    createFSA<types.IUnsubscribeOneTopicOfOneSessionPayload>(
        actionTypes.UNSUBSCRIBE_ONE_TOPIC_OF_ONE_SESSION,
        (options:types.IUnsubscribeOneTopicOfOneSessionPayload) => <any> options
    );

