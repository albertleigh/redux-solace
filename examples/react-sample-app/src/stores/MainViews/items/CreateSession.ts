import {MAIN_VIEW_TYPE, MainBaseView} from 'src/stores/MainViews/base';
import {Model, MODEL_TYPE} from 'redux-anno';

@Model(MODEL_TYPE.PROTOTYPE)
export class CreateSession extends MainBaseView {
  type = MAIN_VIEW_TYPE.CREATE_SESSION;

  constructor() {
    super(MAIN_VIEW_TYPE.CREATE_SESSION);
  }
}
