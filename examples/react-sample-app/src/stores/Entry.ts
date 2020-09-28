import {Model, Instance, createInstance} from 'redux-anno';

import {MainViewManager} from 'src/stores/MainViews/MainViewManager';

@Model()
export class Entry {
  @Instance mainVwMgr = createInstance(MainViewManager);
}

export default Entry;
