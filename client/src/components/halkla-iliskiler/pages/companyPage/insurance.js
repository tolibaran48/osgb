import React, { Fragment, memo, useContext, useEffect } from 'react';
import { MdCheckCircle, MdError, MdCircle } from "react-icons/md";
import { RiIndeterminateCircleFill } from "react-icons/ri";
import { InsurancesContext } from '../../../../context/insurancesContext';
import UpdateInsurance from '../../forms/updateInsurance';

const Insurance = ({ insurance }) => {
  const { updateSelectedInsurance, insuranceState: { selectedId } } = useContext(InsurancesContext);

  useEffect(() => {
    if (selectedId === insurance._id) {
      updateSelectedInsurance(insurance)
    }
  }, [insurance])

  return (
    <Fragment>
      <ul key={insurance._id} className={insurance.workingStatus == 'Kapandı' ? 'notWork' : null}>
        <li id='insuranceNumber' >
          <div className='value'>
            <p>{insurance.descriptiveName}</p>
            <p>{insurance.insuranceNumber}</p>
          </div>
        </li>
        <li id='nokta'>
          <UpdateInsurance insurance={insurance} />
        </li>
        <li id='employeeDanger' >
          <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{insurance.tehlikeSinifi === 'Az Tehlikeli' ?
            <MdCircle style={{ height: '1.28em', width: '1.28em', color: '#007bff' }} /> : insurance.tehlikeSinifi === 'Tehlikeli' ?
              <MdCircle style={{ height: '1.28em', width: '1.28em', color: '#ff8100' }} /> : insurance.tehlikeSinifi === 'Çok Tehlikeli' ?
                <MdCircle style={{ height: '1.28em', width: '1.28em', color: 'red' }} /> : '-'}
          </div>
        </li>
        <li id='employeeCount'>
          <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{insurance.employeeCount}</div>
        </li>

        <div className='rows' style={{ width: '40%', minWidth: '114px' }}>
          <li className='kol '>
            <div className='label'>
              <div >Uzman</div>
            </div>
            <div className='value' >{insurance.assignmentStatus.uzmanStatus.approvalAssignments.length > 0 ? insurance.assignmentStatus.uzmanStatus.approvalAssignments.map((status) => (
              status.approvalStatus === 'Onaylandı' ? <MdCheckCircle key={status.assignmentId} style={{ height: '1.28em', width: '1.28em', color: '#13aa52' }} />
                : status.approvalStatus === 'Profosyonel Onay Bekliyor' || status.approvalStatus === 'Firma Onay Bekliyor' ? <MdError key={status.assignmentId} style={{ height: '1.28em', width: '1.28em', color: '#ff8100' }} />
                  : null
            )) : <RiIndeterminateCircleFill key={0} style={{ height: '1.28em', width: '1.28em', color: 'red' }} />}
            </div>
            <div className='value2'>{insurance.assignmentStatus.uzmanStatus.assignmentTotal}</div>
          </li>
          <li className='kol '>
            <div className='label'>
              <div>Hekim</div>
            </div>
            <div className='value'>{insurance.assignmentStatus.hekimStatus.approvalAssignments.length > 0 ? insurance.assignmentStatus.hekimStatus.approvalAssignments.map((status) => (
              status.approvalStatus === 'Onaylandı' ? <MdCheckCircle key={status.assignmentId} style={{ height: '1.28em', width: '1.28em', color: '#13aa52' }} />
                : status.approvalStatus === 'Profosyonel Onay Bekliyor' || status.approvalStatus === 'Firma Onay Bekliyor' ? <MdError key={status.assignmentId} style={{ height: '1.28em', width: '1.28em', color: '#ff8100' }} />
                  : null
            )) : <RiIndeterminateCircleFill key={0} style={{ height: '1.28em', width: '1.28em', color: 'red' }} />}
            </div>
            <div className='value2'>{insurance.assignmentStatus.hekimStatus.assignmentTotal}</div>
          </li>
          <li className='kol'>
            <div className='label'>
              <div>Dsp</div>
            </div>
            <div className='value'>{insurance.assignmentStatus.dspStatus.approvalAssignments.length > 0 ? insurance.assignmentStatus.dspStatus.approvalAssignments.map((status) => (
              status.approvalStatus === 'Onaylandı' ? <MdCheckCircle key={status.assignmentId} style={{ height: '1.28em', width: '1.28em', color: '#13aa52' }} />
                : status.approvalStatus === 'Profosyonel Onay Bekliyor' || status.approvalStatus === 'Firma Onay Bekliyor' ? <MdError key={status.assignmentId} style={{ height: '1.28em', width: '1.28em', color: '#ff8100' }} />
                  : null
            )) : <RiIndeterminateCircleFill key={0} style={{ height: '1.28em', width: '1.28em', color: 'red' }} />}
            </div>
            <div className='value2'>{insurance.assignmentStatus.dspStatus.assignmentTotal}</div>
          </li>
        </div>
        <div className='rows' style={{ width: '0px', maxWidth: '0px', display: 'none' }}>
          <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', width: '286px' }} className='value'>{insurance.assignmentStatus.uzmanStatus.approvalAssignments ?
            insurance.assignmentStatus.uzmanStatus.approvalAssignments.map((atama) => atama.nameSurname) : null}
          </div>
          <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', width: '286px' }} className='value'>{insurance.assignmentStatus.hekimStatus.approvalAssignments ?
            insurance.assignmentStatus.hekimStatus.approvalAssignments.map((atama) => atama.nameSurname) : null}
          </div>
          <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', width: '286px' }} className='value'>{insurance.assignmentStatus.dspStatus.approvalAssignments ?
            insurance.assignmentStatus.dspStatus.approvalAssignments.map((atama) => atama.nameSurname) : ' '}
          </div>
        </div>
      </ul>
    </Fragment>
  )
}

export default memo(Insurance);