import React, {useCallback} from 'react';
import {Session, ISessionContextConfig} from "redux-solace";

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';

import Typography from '@material-ui/core/Typography';
import ActionAccordion from 'src/components/sessions/ActionAccordion';

import AnnoStore from 'src/stores';

const useStyles = makeStyles({
  root: {
    width: '30vw',
    minWidth: 400,
    maxWidth: 600
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

interface Props{
  context: {
    id:string,
    name:string,
    subscribedTopics:string[],
    config:ISessionContextConfig,
    queueNamesConsumed:string[],
    sessionCacheName:string,
    createdAt:Date,
  };
  onAddOneTopic?:(sessionId:string, topicName:string)=>void;
  onRemoveOneTopic?:(sessionId:string, topicName:string)=>void;
}

export const SessionCard:React.FC<Props> = React.memo<Props>((props)=>{
  const {context, onAddOneTopic, onRemoveOneTopic} = props;
  const classes = useStyles();

  const handleAddOneTopic = useCallback((topicName:string)=>{
    onAddOneTopic && onAddOneTopic(context.id, topicName);
  }, [onAddOneTopic])
  const handleRemoveOneTopic = useCallback((topicName:string)=>{
    onRemoveOneTopic && onRemoveOneTopic(context.id, topicName);
  }, [onRemoveOneTopic])

  const handleRemoveOneSession = useCallback(()=>{
    AnnoStore.store.dispatch(Session.actions.disconnectAndRemoveOneSession({sessionId:context.id}));
  },[context])

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {context.name}
        </Typography>
        <Divider/>

        <ActionAccordion
          sessionId={context.id}
          subscribedTopics={context.subscribedTopics}
          onAddOneTopic={handleAddOneTopic}
          onRemoveOneTopic={handleRemoveOneTopic}
        />

      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleRemoveOneSession}>Close Session</Button>
      </CardActions>
    </Card>
  );
})

export default SessionCard;
