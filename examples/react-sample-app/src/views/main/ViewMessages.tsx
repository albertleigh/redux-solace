import React, {useCallback} from 'react';
import {InsTyp} from 'redux-anno';
import MessageGrid from 'src/components/messages/MessageGrid'

import { ViewMessagesModel} from 'src/stores/MainViews/items/ViewMessagesModel'
import {GridReadyEvent} from "ag-grid-community/dist/lib/events";

interface Props{
  inst: InsTyp<typeof ViewMessagesModel>
}

export const ViewMessages:React.FC<Props> = React.memo<Props>((props) => {

  const {inst} = props;

  const onGridReady = useCallback((evt:GridReadyEvent)=>{
    inst.onGridReady.dispatch(evt)
  },[inst])

  return <MessageGrid onGridReady={onGridReady}/>;
});

export default ViewMessages;
