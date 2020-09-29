import React, {useState, useMemo, useCallback} from 'react';
import {InsTyp, getContext} from 'redux-anno';
import {useSelector} from "react-redux";
import {PublishSubscribe, Session} from "redux-solace";
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SpeedDial  from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import ClearAllIcon from '@material-ui/icons/ClearAll';

import AnnoStore from 'src/stores';
import SessionCard from 'src/components/sessions/SessionCard';
import NewSessionDialog from 'src/components/sessions/NewSessionDialog'
import {SessionManager} from 'src/stores/solaces/SessionManager'
import { CreateSessionModel } from 'src/stores/MainViews/items/CreateSessionModel'

import emptyBoxSvg from 'src/assets/svgs/empty-box.svg';

const topBannerHeightInPx = 48;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: `calc( 100% - ${topBannerHeightInPx}px )`,
      overflow: 'auto',
    },
    sessionCtn:{
      display: 'flex',
      flexWrap: 'wrap',
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
      marginBottom: theme.spacing(10),
      "& > div":{
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1),
      }
    },
    emptySessionCtn:{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      "& > img":{
        maxHeight: '30vmin',
        maxWidth: '30vmin',
        opacity: 0.2,
        marginBottom: theme.spacing(4)
      }
    },
    speedDial: {
      position: 'absolute',
      '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
        bottom: theme.spacing(2),
        right: theme.spacing(2),
      },
      '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
        top: theme.spacing(2),
        left: theme.spacing(2),
      },
    },
  }),
);

interface Props{
  inst: InsTyp<typeof CreateSessionModel>
}

export const CreateSession:React.FC<Props> = React.memo<Props>((props) => {

  const {inst} = props;
  const defaultCtx = getContext();
  const sessionMgr = defaultCtx.getOneInstance(SessionManager)

  const totalSessionCount = useSelector(()=>sessionMgr.total.value);
  const sessionContexts = useSelector(()=>sessionMgr.sessionContexts.value);

  const clz = useStyles();

  const [speedDailOpen, setSpeedDailOpen] = useState(false);
  const closeSpeedDail = () => {
    setSpeedDailOpen(false);
  };
  const openSpeedDail = () => {
    setSpeedDailOpen(true);
  };

  const [newSessionDialogOpen, setNewSessionDialogOpen] = useState(false);
  const openNewSessionDialog = () => {
    setNewSessionDialogOpen(true);
    setSpeedDailOpen(false);
  };
  const closeNewSessionDialog = () => {
    setNewSessionDialogOpen(false);
  };

  const subscribeOneTopicOfOneSession = useCallback((sessionId:string, topicName:string)=>{
    AnnoStore.store.dispatch(PublishSubscribe.actions.subscribeOneTopicOfOneSession({sessionId, topicName}))
  },[])

  const unsubscribeOneTopicOfOneSession = useCallback((sessionId:string, topicName:string)=>{
    AnnoStore.store.dispatch(PublishSubscribe.actions.unsubscribeOneTopicOfOneSession({sessionId, topicName}))
  },[])

  const closeAllSession = useCallback(()=>{
    AnnoStore.store.dispatch(Session.actions.closeAndRemoveAllSessions({}));
  },[])


  const speedDailActions = useMemo(()=>([
    { icon: <ClearAllIcon />, name: 'Clear All', onClick: closeAllSession},
    { icon: <FileCopyIcon />, name: 'New', onClick: openNewSessionDialog }
  ]),[closeAllSession, openNewSessionDialog])

  return (
    <div className={clz.root}>
      {
        totalSessionCount > 0 ?
          <div key="session-ctn" className={clz.sessionCtn}>
            {
              sessionContexts.map((one,index, arr)=>(
                <SessionCard
                  key={one.id}
                  context={one}
                  onAddOneTopic={subscribeOneTopicOfOneSession}
                  onRemoveOneTopic={unsubscribeOneTopicOfOneSession}
                />)
              )
            }
          </div>
          :<div key="empty-session-ctn" className={clz.emptySessionCtn}>
            <img src={emptyBoxSvg} alt="no session found, create one"/>
            <Typography variant="body1" gutterBottom>
              Noop.. no session found, gotta use the plus btn on the bottom right to create one
            </Typography>
          </div>
      }
      <NewSessionDialog open={newSessionDialogOpen} onConnect={inst.onConn.dispatch} onClose={closeNewSessionDialog}/>
      <SpeedDial
        ariaLabel="SpeedDial example"
        className={clz.speedDial}
        icon={<SpeedDialIcon />}
        onClose={closeSpeedDail}
        onOpen={openSpeedDail}
        open={speedDailOpen}
        direction={'up'}
      >
        {speedDailActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick || closeSpeedDail}
          />
        ))}
      </SpeedDial>
    </div>
  );
});

export default CreateSession;
