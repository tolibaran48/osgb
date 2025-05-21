const deleteSelectedRows = (selectedRows, table) => {
    let data = table.data
    let cellHiddens = table.hiddenCells
    let cellStyles = table.cellStyles
    const list = selectedRows.sort(function(a,b){return b-a})
    for (let i = 0; i < list.length; i++) {
        let rowIndex = selectedRows[i]
        let otherHiddens = cellHiddens.filter((x) => x.rowIndex === rowIndex && x.from.rowIndex < rowIndex)
        let rowSpans = cellStyles.filter(x => x.rowIndex === rowIndex && x.row === true && x.col === false)
        let colSpans = cellStyles.filter(x => x.rowIndex === rowIndex && x.col === true && x.row === false)
        let twiceSpans = cellStyles.filter(x => x.rowIndex === rowIndex && x.col === true && x.row === true)
        let hiddensUnique = []
        for (let i = 0; i < otherHiddens.length; i++) {
            let isUnique = hiddensUnique.find(x => x.from.rowIndex === otherHiddens[i].from.rowIndex && x.from.columnId === otherHiddens[i].from.columnId)
            if (!isUnique) {
                hiddensUnique.push(otherHiddens[i])
            }
        }
        for (let i = 0; i < rowSpans.length; i++) {
            let cellStyle = rowSpans[i]
            let rowSpanLength = cellStyle.cellStyle.rowSpan
            if (cellStyle.cellStyle.rowSpan > 2) {
                cellStyles = cellStyles.map((x) => x.rowIndex === cellStyle.rowIndex && x.columnId === cellStyle.columnId ? { ...x, rowIndex: cellStyle.rowIndex + 1, cellStyle: { ...x.cellStyle, rowSpan: rowSpanLength - 1 } } : x)
                cellHiddens = cellHiddens.filter(x => x.rowIndex !== cellStyle.rowIndex + rowSpanLength - 1 || x.columnId !== cellStyle.columnId)
                cellHiddens = cellHiddens.map(x => x.from.rowIndex === cellStyle.rowIndex && x.from.columnId === cellStyle.columnId ? { ...x, rowIndex: x.rowIndex + 1, from: { ...x.from, rowIndex: x.from.rowIndex + 1 } } : x)
            }
            else {
                cellStyles = cellStyles.filter(x => x.rowIndex !== cellStyle.rowIndex || x.columnId !== cellStyle.columnId)
                cellHiddens = cellHiddens.filter(x => x.from.rowIndex !== cellStyle.rowIndex || x.from.columnId !== cellStyle.columnId)
            }
        }
        for (let i = 0; i < colSpans.length; i++) {
            let cellStyle = colSpans[i]
            cellStyles = cellStyles.filter((x) => x.rowIndex !== cellStyle.rowIndex || x.columnId !== cellStyle.columnId)
            cellHiddens = cellHiddens.filter((x) => x.from.rowIndex !== cellStyle.rowIndex || x.from.columnId !== cellStyle.columnId)
        }
        for (let i = 0; i < twiceSpans.length; i++) {
            let cellStyle = twiceSpans[i]
            let rowSpanLength = cellStyle.cellStyle.rowSpan
            let colSpanLength = cellStyle.cellStyle.colSpan
            let columnNumber = parseInt(cellStyle.columnId.slice(7))
            let columnList = []
            for (let i = 0; i < colSpanLength; i++) {
                columnList.push(`column-${columnNumber + i}`)
            }
            if (cellStyle.cellStyle.rowSpan > 2) {
                cellStyles = cellStyles.map((x) => x.rowIndex === cellStyle.rowIndex && x.columnId === cellStyle.columnId ? { ...x, rowIndex: cellStyle.rowIndex + 1, cellStyle: { ...x.cellStyle, rowSpan: rowSpanLength - 1 } } : x)
                cellHiddens = cellHiddens.filter(x => x.rowIndex !== cellStyle.rowIndex + rowSpanLength - 1 || !columnList.includes(x.columnId))
                cellHiddens = cellHiddens.map(x => x.from.rowIndex === cellStyle.rowIndex && x.from.columnId === cellStyle.columnId ? { ...x, rowIndex: x.rowIndex + 1, from: { ...x.from, rowIndex: x.from.rowIndex + 1 } } : x)
            }
            else {
                cellStyles = cellStyles.map((x) => x.rowIndex === cellStyle.rowIndex && x.columnId === cellStyle.columnId ? { ...x, rowIndex: x.rowIndex + 1, row: false, col: true, cellStyle: { colSpan: colSpanLength, style: { height: '1px',position:'relative' } } } : x)
                cellHiddens = cellHiddens.filter(x => x.rowIndex !== cellStyle.rowIndex + rowSpanLength - 1 || !columnList.includes(x.columnId))
                cellHiddens = cellHiddens.map(x => x.from.rowIndex === cellStyle.rowIndex && x.from.columnId === cellStyle.columnId ? { ...x, rowIndex: x.rowIndex + 1, from: { ...x.from, rowIndex: x.from.rowIndex + 1 } } : x)
            }
        }
        for (let i = 0; i < otherHiddens.length; i++) {

        }
        for (let i = 0; i < hiddensUnique.length; i++) {
            let cellHidden = hiddensUnique[i]
            let from = cellStyles.find((x) => x.rowIndex === cellHidden.from.rowIndex && x.columnId === cellHidden.from.columnId)
            let rowSpanLength = from.cellStyle.rowSpan
            let columnNumber = parseInt(from.columnId.slice(7))
            let columnList = []

            if (from.cellStyle.rowSpan > 2) {
                cellStyles = cellStyles.map((x) => x.rowIndex === from.rowIndex && x.columnId === from.columnId ? { ...x, cellStyle: { ...x.cellStyle, rowSpan: from.cellStyle.rowSpan - 1 } } : x)
                if (from.col) {
                    for (let i = 0; i < from.cellStyle.colSpan; i++) {
                        columnList.push(`column-${columnNumber + i}`)
                    }
                    cellHiddens = cellHiddens.filter(x => x.rowIndex !== from.rowIndex + rowSpanLength - 1 || !columnList.includes(x.columnId))
                }
                else {
                    cellHiddens = cellHiddens.filter(x => x.rowIndex !== from.rowIndex + rowSpanLength - 1 || x.columnId !== from.columnId)
                    cellHiddens = cellHiddens.map(x => x.rowIndex > cellHidden.rowIndex && x.columnId === from.columnId && x.from.rowIndex===from.rowIndex? { ...x, rowIndex: x.rowIndex+1 , from: { ...x.from, rowIndex: x.from.rowIndex+1  } } : x)
                }
            }
            else {
                if (from.col) {
                    for (let i = 0; i < from.cellStyle.colSpan; i++) {
                        columnList.push(`column-${columnNumber + i}`)
                    }
                    cellStyles = cellStyles.map((x) => x.rowIndex === from.rowIndex && x.columnId === from.columnId ? { ...x, row: false, cellStyle: { colSpan: from.cellStyle.colSpan, style: { height: '1px',position:'relative' } } } : x)
                    cellHiddens = cellHiddens.filter(x => x.rowIndex !== from.rowIndex + rowSpanLength - 1 || !columnList.includes(x.columnId))
                }
                else {
                    cellStyles = cellStyles.filter((x) => x.rowIndex !== from.rowIndex || x.columnId !== from.columnId)
                    cellHiddens = cellHiddens.filter(x => x.from.rowIndex !== from.rowIndex || x.from.columnId !== from.columnId)
                }
            }
        }
        cellHiddens = cellHiddens.map((x) => x.rowIndex > rowIndex ? { ...x, rowIndex: x.rowIndex - 1, from: { ...x.from, rowIndex: x.from.rowIndex - 1 } } : x)
        cellStyles = cellStyles.map((x) => x.rowIndex > rowIndex ? { ...x, rowIndex: x.rowIndex - 1 } : x)


        data=data.filter((x, index) => index !== rowIndex)
    }

    return { data: data, cellHiddens: cellHiddens, cellStyles: cellStyles }
}

module.exports = deleteSelectedRows;