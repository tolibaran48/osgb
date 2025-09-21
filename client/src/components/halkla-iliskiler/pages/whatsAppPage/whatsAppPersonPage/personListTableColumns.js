import React, { Fragment, useContext, memo } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/tr';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { BsFiletypePdf } from "react-icons/bs";
import './personTable.scss'
import PersonListTable from './PersonListTable';
import turkishToEnglish from '../../../../../functions/turkishToEnglish';


const PersonListTableColumns = ({ employees }) => {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.extend(customParseFormat)
    dayjs.locale('tr')

    const columns = React.useMemo(
        () => [
            {
                id: "identityId",
                Header: "TC",
                accessor: "identityId",
                Cell: props => {
                    return (
                        props.row.original.person.identityId
                    )
                },
                filter: (rows, id, filterValue) => {
                    return rows.filter(row => {
                        const rowValue = row.original.person.identityId;
                        let value = turkishToEnglish(filterValue).toLowerCase();
                        return rowValue !== undefined
                            ? rowValue.toLowerCase().includes(value) : true;
                    });
                },
                Filter: ({ column }) => {
                    const { filterValue, setFilter, Header, id } = column;

                    return (
                        <fieldset >
                            <div className='input' style={{ position: 'relative' }}>
                                <input className='form-control' id={id}
                                    placeholder='TC...'

                                    value={filterValue || ''}
                                    onChange={event => { setFilter(event.target.value) }}
                                />
                                <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                </div>
                            </div>
                        </fieldset>
                    )
                },
            },
            {
                id: "name",
                Header: "Adı",
                accessor: "name",
                Cell: props => {
                    return (`${props.row.original.person.name} ${props.row.original.person.surname}`)
                },
                filter: (rows, id, filterValue) => {
                    return rows.filter(row => {
                        const rowValue = {
                            'name': row.original.person.name,
                            'surame': row.original.person.surname ?? ""
                        };
                        let value = turkishToEnglish(filterValue).toLowerCase();
                        return rowValue !== undefined
                            ? turkishToEnglish(rowValue.name).toLowerCase().includes(value) || turkishToEnglish(rowValue.surame).toLowerCase().includes(value)
                            : true;
                    });
                },
                Filter: ({ column }) => {
                    const { filterValue, setFilter, Header, id } = column;

                    return (
                        <fieldset >
                            <div className='input' style={{ position: 'relative' }}>
                                <input className='form-control' id={id}
                                    placeholder='Adı Soyadı...'

                                    value={filterValue || ''}
                                    onChange={event => { setFilter(event.target.value) }}
                                />
                                <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
                                </div>
                            </div>
                        </fieldset>
                    )
                },
            },
            {
                id: "processTime",
                Header: "İşlem Tarihi",
                accessor: "processTime",
                Cell: props => {
                    return (
                        dayjs(props.row.original.processTime).format('DD/MM/YYYY')
                    )
                },
                disableFilters: true
            },
            {
                id: "pdfButton",
                Header: " ",
                accessor: "pdfButton",
                Cell: props => {
                    return (
                        <a href={`/media/${props.row.original.fileLink}`} download="person.pdf" type="application/pdf"><BsFiletypePdf style={{ fontSize: '1.4rem', color: 'red' }} /></a>
                    )
                },
                disableFilters: true
            },
        ], []
    )

    return (
        <Fragment>
            <PersonListTable data={employees} columns={columns} />
        </Fragment>
    );

}

export default memo(PersonListTableColumns);
