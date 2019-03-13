import * as solace from 'solclientjs/lib-browser/solclient';

import { IEventActionDict } from './types'

import makeType from '../utils/makeType';
import createFSA from '../utils/createFSA';

export default ():IEventActionDict=>{

    const result = {
        // basic session event
        [solace.SessionEventCode.UP_NOTICE]:{actionType:makeType('UP_NOTICE')},
        [solace.SessionEventCode.CONNECT_FAILED_ERROR]:{actionType:makeType('CONNECT_FAILED_ERROR')},
        [solace.SessionEventCode.DISCONNECTED]:{actionType:makeType('DISCONNECTED')},
        [solace.SessionEventCode.SUBSCRIPTION_ERROR]:{actionType:makeType('SUBSCRIPTION_ERROR')},
        [solace.SessionEventCode.SUBSCRIPTION_OK]:{actionType:makeType('SUBSCRIPTION_OK')},
        [solace.SessionEventCode.MESSAGE]:{actionType:makeType('MESSAGE')},

        // additional session event
        [solace.SessionEventCode.ACKNOWLEDGED_MESSAGE]:{actionType:makeType('ACKNOWLEDGED_MESSAGE')},
        [solace.SessionEventCode.CAN_ACCEPT_DATA]:{actionType:makeType('CAN_ACCEPT_DATA')},
        [solace.SessionEventCode.DOWN_ERROR]:{actionType:makeType('DOWN_ERROR')},
        [solace.SessionEventCode.GUARANTEED_MESSAGE_PUBLISHER_DOWN]:{actionType:makeType('GUARANTEED_MESSAGE_PUBLISHER_DOWN')},
        [solace.SessionEventCode.PROPERTY_UPDATE_ERROR]:{actionType:makeType('PROPERTY_UPDATE_ERROR')},
        [solace.SessionEventCode.PROPERTY_UPDATE_OK]:{actionType:makeType('PROPERTY_UPDATE_OK')},
        [solace.SessionEventCode.RECONNECTED_NOTICE]:{actionType:makeType('RECONNECTED_NOTICE')},
        [solace.SessionEventCode.RECONNECTING_NOTICE]:{actionType:makeType('RECONNECTING_NOTICE')},
        [solace.SessionEventCode.REJECTED_MESSAGE_ERROR]:{actionType:makeType('REJECTED_MESSAGE_ERROR')},
        [solace.SessionEventCode.REPUBLISHING_UNACKED_MESSAGES]:{actionType:makeType('REPUBLISHING_UNACKED_MESSAGES')},
        [solace.SessionEventCode.UNSUBSCRIBE_TE_TOPIC_ERROR]:{actionType:makeType('UNSUBSCRIBE_TE_TOPIC_ERROR')},
        [solace.SessionEventCode.UNSUBSCRIBE_TE_TOPIC_OK]:{actionType:makeType('UNSUBSCRIBE_TE_TOPIC_OK')},
        [solace.SessionEventCode.VIRTUALROUTER_NAME_CHANGED]:{actionType:makeType('VIRTUALROUTER_NAME_CHANGED')},

        // consumer event
        [solace.MessageConsumerEventName.ACTIVE]:{actionType:makeType('CONSUMER_ACTIVE')},
        [solace.MessageConsumerEventName.CONNECT_FAILED_ERROR]:{actionType:makeType('CONSUMER_CONNECT_FAILED_ERROR')},
        [solace.MessageConsumerEventName.DISPOSED]:{actionType:makeType('CONSUMER_DISPOSED')},
        [solace.MessageConsumerEventName.DOWN]:{actionType:makeType('CONSUMER_DOWN')},
        [solace.MessageConsumerEventName.DOWN_ERROR]:{actionType:makeType('CONSUMER_DOWN_ERROR')},
        [solace.MessageConsumerEventName.GM_DISABLED]:{actionType:makeType('CONSUMER_GM_DISABLED')},
        [solace.MessageConsumerEventName.INACTIVE]:{actionType:makeType('CONSUMER_INACTIVE')},
        [solace.MessageConsumerEventName.MESSAGE]:{actionType:makeType('CONSUMER_MESSAGE')},
        [solace.MessageConsumerEventName.UP]:{actionType:makeType('CONSUMER_UP')},
    };

    Object.keys(result).forEach((eventCode)=>{
        result[eventCode].action = createFSA(
            result[eventCode].actionType,
            options => (options)
        )
    });

    return result as IEventActionDict;
}