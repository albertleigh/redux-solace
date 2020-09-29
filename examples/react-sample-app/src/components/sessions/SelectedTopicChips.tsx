import React, {useCallback} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  }),
);

interface Props{
  labels: string[];
  onRemoveOneTopic?:(topicName:string)=>void;
}

const SelectedTopicChips:React.FC<Props> =  React.memo<Props>((props) => {
  const classes = useStyles();

  const {labels, onRemoveOneTopic} = props;

  const handleDelete = useCallback((topicName)=>()=>{
    onRemoveOneTopic && onRemoveOneTopic(topicName)
  },[onRemoveOneTopic])

  return (
    <Paper component="ul" className={classes.root}>
      {labels.map((label) => {
        return (
          <li key={label}>
            <Chip
              className={classes.chip}
              label={label}
              color="primary"
              onDelete={handleDelete(label)}
            />
          </li>
        );
      })}
    </Paper>
  );
});

export default SelectedTopicChips;
