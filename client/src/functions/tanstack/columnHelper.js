import { createColumnHelper } from '@tanstack/react-table';
import TableCell from './tableCell';
import EditCell from './editCell';

const ColumnHelper = (_table) => {
  
  let columnHelper = createColumnHelper();
  const columns = [];
  let keys=Object.keys(_table.headers)

  for (let i = 0; i < keys.length; i++) {
    columns.push(
      columnHelper.accessor(
        keys[i], {
        header:  _table.headers[keys[i]],
        cell: TableCell,
       // enableResizing:false,
        meta: {
          type: "zengin metin",
        }
      })
    )
  }
  columns.push(
    columnHelper.display({
      id: "edit",
      cell: EditCell,
      meta: {
      }
    }))
    
  return columns
}

export default ColumnHelper;