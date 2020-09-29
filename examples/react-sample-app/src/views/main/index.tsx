import React, {useMemo} from 'react';
import {getContext, InsTyp} from 'redux-anno';
import {useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import {MainBaseView, MAIN_VIEW_TYPE} from 'src/stores/MainViews/base';
import {ViewMessages} from 'src/views/main/ViewMessages';
import {ViewMessagesModel} from 'src/stores/MainViews/items/ViewMessagesModel'
import {CreateSession} from 'src/views/main/CreateSession';
import {CreateSessionModel} from 'src/stores/MainViews/items/CreateSessionModel'
import {MainViewManager} from 'src/stores/MainViews/MainViewManager';

import logo from 'src/logo.svg';

const useEmptyOverlayStyle = makeStyles({
  ctn: {
    display: 'grid',
    placeItems: 'center',
    width: '100%',
    height: '100%',
  },
  img: {
    width: '25vmin',
    height: '25vmin',
    opacity: 0.4,
  },
});

const EmptyOverlay = React.memo(() => {
  const clz = useEmptyOverlayStyle();
  return (
    <div className={clz.ctn}>
      <img className={clsx(clz.img, 'bounce')} src={logo} />
    </div>
  );
});

function getMainViewItem(item: MainBaseView) {
  switch (item.type) {
    case MAIN_VIEW_TYPE.CREATE_SESSION:
      return <CreateSession key={MAIN_VIEW_TYPE.CREATE_SESSION} inst={item as InsTyp<typeof CreateSessionModel>} />;
    case MAIN_VIEW_TYPE.VIEW_MESSAGES:
      return <ViewMessages key={MAIN_VIEW_TYPE.VIEW_MESSAGES} inst={item as InsTyp<typeof ViewMessagesModel>} />;
  }
  return null;
}

export const MainViewSwitcher = React.memo(() => {
  const defaultCtx = useMemo(getContext, []);
  const mainViewMgr = defaultCtx.getOneInstance(MainViewManager);

  const viewItems = useSelector(() => mainViewMgr.items.value);
  const length = useMemo(() => viewItems.length, [viewItems]);

  return <>{!!length ? getMainViewItem(viewItems[length - 1]) : <EmptyOverlay />}</>;
});

export default MainViewSwitcher;
