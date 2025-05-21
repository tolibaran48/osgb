import { createColumnHelper } from '@tanstack/react-table';
import TableCell from './tableCell';
import EditCell from './editCell';

const HeaderHelper = (_table) => {

    let columnHelper = createColumnHelper();
    let columns = []
    let primaryColumns = {}

    for (let i = 0; i < _table.columnLength; i++) {
        primaryColumns[`column-${i}`] =
            columnHelper.accessor(
                `column-${i}`, {
                header: _table.headers[`column-${i}`],
                cell: TableCell,
                meta: {
                    type: "zengin metin",
                }
            })
    }

    let last = primaryColumns
    for (let i = _table.headerGroups.length - 1; i > 0; i -= 1) {
        let previousrow = _table.headerGroups.find(x => x.flat === i)
        console.log(_table.headerGroups)
        let prev = {}
        for (let j = 0; j < previousrow.headers.length; j++) {
            prev[previousrow.headers[j].id] = { header: previousrow.headers[j].id, columns: [] }
            for (let k = 0; k < previousrow.headers[j].subHeaders.length; k++) {
                prev = { ...prev, [previousrow.headers[j].id]: { ...prev[previousrow.headers[j].id], columns: [...prev[previousrow.headers[j].id].columns, last[previousrow.headers[j].subHeaders[k]]] } }
                delete primaryColumns[previousrow.headers[j].subHeaders[k]]
            }
        }
        last = prev
    }

    let keys = Object.keys(last)
    for (let i = 0; i < keys.length; i++) {
        columns.push(last[keys[i]])
    }

    let primaryKeys = Object.keys(primaryColumns)
    if (primaryKeys.length > 0) {
        for (let j = 0; j < primaryKeys.length; j++) {
            console.log(primaryColumns[primaryKeys[j]])
            columns.push(primaryColumns[primaryKeys[j]])
        }
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

export default HeaderHelper;