import React, { Fragment, memo } from 'react';

const Contact = ({ contactInformation }) => {

    return (
        <Fragment>
            <ul >
                <li id='nameSurname' >
                    <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {`${contactInformation.name} ${contactInformation.surname}`}
                    </div>
                </li>
                <li id='nokta'>
                    <button >&#65049;</button>
                </li>
                <li id='position' >
                    <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {contactInformation.employment}
                    </div>
                </li>
                <li id='email'>
                    <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{
                        contactInformation.email
                    }</div>
                </li>
                <li id='phoneNumber'>
                    {
                        contactInformation.phoneNumber
                    }
                </li>
            </ul>
        </Fragment>
    )
}

export default memo(Contact);