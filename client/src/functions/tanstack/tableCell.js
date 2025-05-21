import React, { useState, useEffect, Fragment } from 'react';
import { PiSquareSplitVerticalFill, PiSquareSplitHorizontalFill } from "react-icons/pi";
import { FaAlignCenter, FaAlignLeft } from "react-icons/fa6";
import MyEditor from '../draft/editor';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

const TableCell = ({ getValue, row, column, table }) => {

    const initialValue = getValue()
    const columnMeta = column.columnDef.meta;
    const tableMeta = table.options.meta;
    const [value, setValue] = useState(initialValue)
    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])
    const onBlurs = (editorState) => {
        let content = JSON.stringify(convertToRaw(editorState.getCurrentContent()))
        //setValue(draftToHtml(JSON.parse(content)))
        tableMeta?.updateData(row.index, column.id, content);
    }

    if (tableMeta?.editedRows[row.id]) {
        if (columnMeta?.type === "zengin metin") {
            return (
                <MyEditor
                    onBlurs={onBlurs}
                    style={{ width: '100%' }}
                    value={value}
                />
            )
        }
        else {
            return (
                <input
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onBlur={onBlurs}
                    style={{ width: '100%' }}
                    type={columnMeta?.type || "text"}
                />
            )
        }
    }
    return (
        <>
            <div className='cellManangmentButton' style={{ position: 'absolute', width: '100%', visibilty: 'hidden', display: 'flex', flexDirection: 'row', gap: '3px', top: '0', left: 0 }}>
                <PiSquareSplitVerticalFill onClick={() => { tableMeta?.setRowSpan(row.index, column.id, value) }} />
                <PiSquareSplitHorizontalFill onClick={() => { tableMeta?.setColSpan(row.index, column.id, value) }} />
                <FaAlignCenter onClick={() => { console.log({ 'rowIndex': row.index, 'columnId': column.id }) }} />
                <FaAlignLeft onClick={() => { console.log({ 'rowIndex': row.index, 'columnId': column.id }) }} />
            </div>
            {
                columnMeta?.type === "zengin metin" && value !== undefined ?
                    <span dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(value)) }}></span>
                    :
                    value
            }

        </>
    );
}

export default TableCell;
