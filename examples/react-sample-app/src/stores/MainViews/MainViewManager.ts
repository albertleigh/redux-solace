import {AnyClass, createSelf, getContext, InsTyp, Model, MODEL_TYPE, Saga, SAGA_TYPE, Self} from 'redux-anno';
import {BaseStackViewManager} from 'redux-anno-utils/lib/examples/StackViews/StackViewManager';
import {MAIN_VIEW_TYPE, MainBaseView} from 'src/stores/MainViews/base';
import SvgIcon from '@material-ui/core/SvgIcon';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import StorageIcon from '@material-ui/icons/StorageTwoTone';

import {CreateSessionModel} from 'src/stores/MainViews/items/CreateSessionModel';
import {ViewMessagesModel} from 'src/stores/MainViews/items/ViewMessagesModel';

export interface MainViewOption {
  type: MAIN_VIEW_TYPE;
  label: string;
  icon: typeof SvgIcon;
  onClick: (evt: any) => void;
}

export const mainViewOptions: MainViewOption[] = [
  {
    type: MAIN_VIEW_TYPE.CREATE_SESSION,
    label: 'Sessions',
    icon: ViewComfyIcon,
    onClick: () => {
      const defaultCtx = getContext();
      const mainViewMgr = defaultCtx.getOneInstance(MainViewManager);
      mainViewMgr.redirectTo.dispatch({
        model: CreateSessionModel,
        args: [],
      });
    },
  },
  {
    type: MAIN_VIEW_TYPE.VIEW_MESSAGES,
    label: 'Messages',
    icon: StorageIcon,
    onClick: () => {
      const defaultCtx = getContext();
      const mainViewMgr = defaultCtx.getOneInstance(MainViewManager);
      mainViewMgr.redirectTo.dispatch({
        model: ViewMessagesModel,
        args: [],
      });
    },
  },
];

@Model(MODEL_TYPE.SINGLETON)
export class MainViewManager extends BaseStackViewManager<AnyClass<MainBaseView>> {
  *onPageAdded(_ins: InsTyp<AnyClass<MainBaseView>>): Generator<any, any, any> {
    console.log('[MainViewManager::onPageAdded]', _ins);
    return;
  }

  *onPageRemoved(_ins: InsTyp<AnyClass<MainBaseView>>): Generator<any, any, any> {
    console.log('[MainViewManager::onPageRemoved]', _ins);
    return;
  }

  @Self self = createSelf(MainViewManager);


  @Saga(SAGA_TYPE.AUTO_RUN)
  *entry() {
    yield* this.redirectTo({
      model: CreateSessionModel,
      args: [],
    })
  }

  @Saga()
  *redirectToOneMainView<C extends AnyClass<MainBaseView>>(payload: {
    model: C;
    args: ConstructorParameters<C>;
    force?: boolean;
  }) {
    yield* this.redirectTo(payload);
  }
}
export default MainViewManager;
