import {BaseViewItem} from 'redux-anno-utils/lib/examples/StackViews/ViewItem';

export enum MAIN_VIEW_TYPE {
  CREATE_SESSION = 'MAIN_CREATE_SESSION',
  VIEW_MESSAGES = 'MAIN_VIEW_MESSAGES',
}

export abstract class MainBaseView extends BaseViewItem {
  abstract type: MAIN_VIEW_TYPE;
}
