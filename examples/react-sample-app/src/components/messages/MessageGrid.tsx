import React, {useRef, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react';
import {GridReadyEvent} from "ag-grid-community/dist/lib/events";
import {GridApi} from "ag-grid-community/dist/lib/gridApi";
import {ColumnApi} from "ag-grid-community/dist/lib/columnController/columnApi";
import {ColDef, ColGroupDef} from "ag-grid-community/dist/lib/entities/colDef";

const columnDefs:(ColDef | ColGroupDef)[] = [
  { headerName: 'Session', field: 'sessionName'},
  { headerName: 'Destination',
    valueGetter:(params)=>{
      if (params.data.destination && params.data.destination.type && params.data.destination.name){
        return  `${params.data.destination.type}:${params.data.destination.name}`
      }
      return 'Unknown'
    }
  },
  { headerName: 'Binary Attachment', field: 'binaryAttachment'},
  { headerName: 'Attachment', valueGetter:(params)=>{
      if (params.data.attachment ){
        return  JSON.stringify(params.data.attachment);
      }
      return 'n/a'
    }
  },
  {headerName: 'Create Time', field: 'ctime', resizable: true }
]

interface Props{
  onGridReady?(event: GridReadyEvent): void
}

export const MessageGrid:React.FC<Props> = React.memo<Props>((props)=>{

  const {onGridReady} = props;

  const gridApi = useRef((null as unknown) as GridApi);
  const gridColumnApi = useRef((null as unknown) as ColumnApi);

  const handleGridReady = useCallback((event: GridReadyEvent)=>{
    if (!!event){
      gridApi.current = event.api;
      gridColumnApi.current = event.columnApi;

      onGridReady && onGridReady(event)

      setTimeout(()=>{
        event.api.sizeColumnsToFit();
      });
    }
  },[])

  return (<div style={{height: 'calc( 100vh - 48px )', width: '100%'}} className="ag-theme-alpine" >
    <AgGridReact
      // properties
      columnDefs={columnDefs}
      defaultColDef={{
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        sortable: true,
        filter: true,
        resizable: true,
      }}
      animateRows={true}
      // events
      onGridReady={handleGridReady}>
    </AgGridReact>
  </div>)
})

export default MessageGrid;
