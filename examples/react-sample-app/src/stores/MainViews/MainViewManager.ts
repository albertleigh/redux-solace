import {AnyClass, createSelf, getContext, InsTyp, Model, MODEL_TYPE, Saga, SAGA_TYPE, Self} from 'redux-anno';
import {BaseStackViewManager} from 'redux-anno-utils/lib/examples/StackViews/StackViewManager';
import {MAIN_VIEW_TYPE, MainBaseView} from 'src/stores/MainViews/base';
import SvgIcon from '@material-ui/core/SvgIcon';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import StorageIcon from '@material-ui/icons/StorageTwoTone';

import {CreateSession} from 'src/stores/MainViews/items/CreateSession';
import {ViewMessages} from 'src/stores/MainViews/items/ViewMessages';

export interface MainViewOption {
  type: MAIN_VIEW_TYPE;
  label: string;
  icon: typeof SvgIcon;
  onClick: (evt: any) => void;
}

export const mainViewOptions: MainViewOption[] = [
  {
    type: MAIN_VIEW_TYPE.CREATE_SESSION,
    label: 'Create Session',
    icon: ViewComfyIcon,
    onClick: () => {
      const defaultCtx = getContext();
      const mainViewMgr = defaultCtx.getOneInstance(MainViewManager);
      mainViewMgr.redirectTo.dispatch({
        model: CreateSession,
        args: [],
      });
    },
  },
  {
    type: MAIN_VIEW_TYPE.VIEW_MESSAGES,
    label: 'View Messages',
    icon: StorageIcon,
    onClick: () => {
      const defaultCtx = getContext();
      const mainViewMgr = defaultCtx.getOneInstance(MainViewManager);
      mainViewMgr.redirectTo.dispatch({
        model: ViewMessages,
        args: [],
      });
    },
  },
];

@Model(MODEL_TYPE.SINGLETON)
export class MainViewManager extends BaseStackViewManager<MainBaseView> {
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
      model: CreateSession,
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
