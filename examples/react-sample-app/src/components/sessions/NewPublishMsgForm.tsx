import React, {useState, useEffect, useCallback} from 'react';
import {PublishSubscribe} from "redux-solace";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import AnnoStore from 'src/stores';

interface Props{
  sessionId: string;
  subscribedTopics:string[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    outCtn:{
      display:'flex',
      flexDirection: 'column',
      alignItems:'stretch',
      width: "100%",

    },
    actBtnCtn:{
      marginTop: theme.spacing(2),
    }
  }),
);

const filter = createFilterOptions<string>();

const NewPublishMsgForm:React.FC<Props> = React.memo<Props>((props)=>{
  const {sessionId, subscribedTopics} = props;

  const clz = useStyles();

  const [selectedTopic, setSelectedTopic] = useState("");
  const [msgText, setMsgText] = useState("");

  const publishOneTxtMsgToOneSession = useCallback(()=>{
    !!selectedTopic && AnnoStore.store.dispatch(PublishSubscribe.actions.publishOneTxtMsgToOneSession({
      sessionId,
      topicName: selectedTopic,
      msgText
    }))
  },[sessionId, msgText, selectedTopic])

  return (<div className={clz.outCtn}>
    <Autocomplete
      value={selectedTopic}
      onChange={(event, newValue:any) => {
        if (typeof newValue === 'string') {
          setSelectedTopic(newValue);
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setSelectedTopic(newValue.inputValue);
        } else {
          setSelectedTopic(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        // Suggest the creation of a new value
        if (params.inputValue !== '') {
          filtered.push(params.inputValue);
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={subscribedTopics}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option;
      }}
      renderOption={(option) => option}
      style={{ width: "100%" }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label="Topic to publish" variant="standard" />
      )}
    />
    <TextField
      id={`message--${sessionId}`}
      label="Message Text"
      placeholder="Fill the text to be sent as the message payload"
      value={msgText}
      onChange={(event)=>{
        setMsgText(event.target.value);
      }}
      multiline
      rows={8}
    />
    <div className={clz.actBtnCtn}>
      <Button variant="contained" color="primary" size="small" disabled={!selectedTopic} onClick={publishOneTxtMsgToOneSession}>
        Publish
      </Button>
    </div>
  </div>)
})

export default NewPublishMsgForm;
