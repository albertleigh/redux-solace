import React, {MouseEvent, useRef, useState, useEffect, useCallback, ChangeEvent} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// hostUrl	The url to create and connect a solace session, and this url must start with http://, https://, ws:// or wss://
// vpn	the vpn name
// username	the user name
// sessionCache	the cache name of the session
// pass	the password of the user
// config.usePerMsgAck	the boolean flag to enable per msg acknowledge mode or not for queue comm pattern

type ErrorMessage = undefined | {error: boolean; helperText: string}
type ExtractErrorsMessages<T> =  Partial<{[K in keyof T]:ErrorMessage}>;

export interface NewSession{
  hostUrl: string,
  vpn: string,
  username: string,
  sessionCache: string,
  pass: string,
}
type NewSessionErrors = ExtractErrorsMessages<NewSession>;

function validateRequiredField(obj:any, fieldName:string):ErrorMessage{
  if (!(fieldName in obj) || !obj[fieldName] || (typeof obj[fieldName] === "string" && !obj[fieldName].trim())){
    return {
      error: true,
      helperText: `${fieldName} is required`
    }
  }
  return undefined;
}

function validateNewSession(obj:NewSession):NewSessionErrors{
  const result:NewSessionErrors = {};
  const requiredFields:Array<keyof NewSession> = ["hostUrl", "username", "vpn"];

  // required
  for (const oneField of requiredFields){
    result[oneField] = validateRequiredField(obj,oneField)
  }

  // regex
  if (
    !!obj?.hostUrl &&
    !(/(https?|wss?):\/\/((www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)|(localhost:.*))/.test(obj.hostUrl))
  ){
    result.hostUrl = {
      error: true,
      helperText: 'The url must start with http://, https://, ws:// or wss://'
    }
  }

  return result
}

interface NewSessionFormProps{
  initObj?:NewSession;
  onReady?:(obj:NewSession)=>void;
  onError?:(obj:NewSessionErrors|undefined)=>void;
}
const NewSessionForm:React.FC<NewSessionFormProps> = React.memo<NewSessionFormProps>((props)=>{

  const {initObj, onReady, onError} = props;

  const skipOnErr = useRef(1);

  const [obj, setObj] = useState<NewSession>(initObj || {
    hostUrl: "",
    vpn: "",
    username: "",
    sessionCache: "",
    pass: "",
  });
  const [objErrs,setObjErrs] = useState<NewSessionErrors>({})

  const onValueChange = useCallback((fieldName:keyof NewSession)=>(event:ChangeEvent<HTMLInputElement>)=>{
    const newObj = {
      ...obj,
      [fieldName]:event.target.value
    };
    setObjErrs(validateNewSession(newObj));
    setObj(newObj);
  }, [obj,setObj]);

  useEffect(()=>{
    if (Object.entries(objErrs).every(([oneField]) => !(objErrs as any)[oneField])){
      if (!!skipOnErr.current){
        skipOnErr.current -= 1;
      }else{
        onReady && onReady(obj);
        onError && onError(undefined);
      }
    }else{
      onError && onError(objErrs);
    }
  },[objErrs])

  return (<>
    <TextField
      autoFocus
      required
      margin="dense"
      id="hostUrl"
      label="Host Url"
      type="text"
      variant="outlined"
      onChange={onValueChange('hostUrl')}
      error={!!objErrs['hostUrl']?.error}
      helperText={!!objErrs['hostUrl']?.error ? objErrs['hostUrl']?.helperText: ''}
      fullWidth
    />
    <TextField
      required
      margin="dense"
      id="vpn"
      label="VPN"
      type="text"
      variant="outlined"
      onChange={onValueChange('vpn')}
      error={!!objErrs['vpn']?.error}
      helperText={!!objErrs['vpn']?.error ? objErrs['vpn']?.helperText: ''}
      fullWidth
    />
    <TextField
      required
      margin="dense"
      id="username"
      label="Username"
      type="text"
      variant="outlined"
      onChange={onValueChange('username')}
      error={!!objErrs['username']?.error}
      helperText={!!objErrs['username']?.error ? objErrs['username']?.helperText: ''}
      fullWidth
    />
    <TextField
      margin="dense"
      id="pass"
      label="Password"
      type="password"
      onChange={onValueChange('pass')}
      error={!!objErrs['pass']?.error}
      helperText={!!objErrs['pass']?.error ? objErrs['pass']?.helperText: ''}
      variant="outlined"
      fullWidth
    />
    <TextField
      margin="dense"
      id="sessionCache"
      label="Session Cache"
      type="text"
      variant="outlined"
      onChange={onValueChange('sessionCache')}
      error={!!objErrs['sessionCache']?.error}
      helperText={!!objErrs['sessionCache']?.error ? objErrs['sessionCache']?.helperText: ''}
      fullWidth
    />
  </>)
})

interface Props{
  open:boolean;
  onConnect?:(conn:NewSession)=>any;
  onClose:(evt?:MouseEvent|any, reason?:string)=>void;
}

const NewSessionDialog:React.FC<Props> = React.memo<Props>((props)=>{

  const { open, onConnect, onClose } = props;

  const [disableConn, setDisableConn] = useState(true)
  const [obj, setObj] = useState<NewSession>({
    hostUrl: "",
    vpn: "",
    username: "",
    sessionCache: "",
    pass: "",
  });

  const handleFormReady = useCallback((newObj:NewSession)=>{
    setObj(newObj);
  }, [setObj])

  const handleFormError = useCallback((err:NewSessionErrors|undefined)=>{
    setDisableConn(!!err);
  }, [setDisableConn])

  const handleConn = useCallback(()=>{
    onConnect && onConnect(obj);
    setDisableConn(true);
    onClose();
  },[onConnect, obj, setDisableConn, onClose])


  return (<Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">New Session</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Create a new solace session and connect it
      </DialogContentText>
      <NewSessionForm
        initObj={obj}
        onReady={handleFormReady}
        onError={handleFormError}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleConn} color="primary" disabled={disableConn}>
        Connect
      </Button>
      <Button onClick={onClose} color="secondary">
        Cancel
      </Button>
    </DialogActions>
  </Dialog>)
})

export default NewSessionDialog;
