import actionsGenerator from './actionsGenerator';

import {IEventActionDict} from './types';

export const actionsDict:IEventActionDict = actionsGenerator();

export default {
    actionsDict,
}