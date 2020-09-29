import React, {useState, useCallback, KeyboardEventHandler, KeyboardEvent} from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Divider from "@material-ui/core/Divider";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import SelectedTopicChips from "src/components/sessions/SelectedTopicChips";
import NewPublishMsgForm from 'src/components/sessions/NewPublishMsgForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    topicDetails:{
      display:'flex',
      flexDirection:'column',
      alignItems:'stretch'
    }
  }),
);

interface Props{
  sessionId:string;
  subscribedTopics: string[];
  onAddOneTopic?:(topicName:string)=>void;
  onRemoveOneTopic?:(topicName:string)=>void;
}

const ActionAccordion:React.FC<Props> =  React.memo<Props>((props) => {

  const {sessionId, subscribedTopics, onAddOneTopic ,onRemoveOneTopic} = props;

  const classes = useStyles();

  const [newTopicName, setNewTopicName] = useState("");
  const handleNewTopicNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>)=>{
    setNewTopicName(event.target.value);
  },[setNewTopicName])
  const handleNewTopicNameEnter = useCallback((event: React.KeyboardEvent<HTMLInputElement>)=>{
    if (event.key === "Enter"){
      event.preventDefault();
      onAddOneTopic && onAddOneTopic(newTopicName);
      setNewTopicName("");
    }
  },[newTopicName, setNewTopicName, onAddOneTopic])

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading}>Subscribe Topics</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.topicDetails} >
          <SelectedTopicChips labels={subscribedTopics} onRemoveOneTopic={onRemoveOneTopic}/>
          <Divider/>
          <TextField
            id={`new-topic-text-${sessionId}`}
            label="Add a new Topic"
            value={newTopicName}
            onChange={handleNewTopicNameChange}
            onKeyPress={handleNewTopicNameEnter}
            variant="standard"
            fullWidth
          />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading}>Publish Messages</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <NewPublishMsgForm sessionId={sessionId} subscribedTopics={subscribedTopics}/>
        </AccordionDetails>
      </Accordion>
    </div>
  );
})

export default ActionAccordion;
