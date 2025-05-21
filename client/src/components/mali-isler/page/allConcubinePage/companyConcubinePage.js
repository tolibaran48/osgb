import React, { useState, useEffect, useContext } from 'react';
import ConcubineList from './concubineList';
import { GET_COMPANIES_CONCUBINE, GET_CONCUBINES } from '../../../../GraphQL/Queries/concubine/concubine';
import { AuthContext } from '../../../../context/authContext';
import { ConcubinesContext } from '../../../../context/concubinesContext';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import './companyConcubinePage.scss';
import _ from 'lodash';

const CompanyConcubinePage = () => {
    const navigate = useNavigate();
    const { signOut } = useContext(AuthContext);
    const { getConcubines, concubineState: { concubines } } = useContext(ConcubinesContext);
    const [selects, setSelects] = useState([]);
    const [silConcubines, setSilConcubines] = useState([]);

    const [getCompanyConcubine, { loading: getCompanyConcubineLoading }] = useLazyQuery(GET_COMPANIES_CONCUBINE, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            getConcubines(data.companyConcubines);
        },
        onError({ graphQLErrors }) {
            const err = graphQLErrors[0].extensions;
            console.log(err)
            if (err.status && err.status == 401) {
                signOut()
                navigate('/portal-giris')
            }
        }
    });

    const [_getConcubines, { loading }] = useLazyQuery(GET_CONCUBINES, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            setSilConcubines(data.concubines)
            //getConcubines(data.Concubines);
            console.log(data.concubines)
        },
        onError({ graphQLErrors }) {
            const err = graphQLErrors[0].extensions;
            console.log(err)
            if (err.status && err.status == 401) {
                signOut()
                navigate('/portal-giris')
            }
        }
    });

    useEffect(() => {
        !concubines.length > 0 && getCompanyConcubine()
        //_getConcubines()
        return () => {
        }
    }, [])

    const Bul = async () => {
        let fats = await _.filter(
            _.uniq(
                _.map(silConcubines, function (item) {
                    if (_.filter(silConcubines, { processNumber: item.processNumber }).length > 1) {
                        return item.processNumber;
                    }

                    return false;
                })),
            function (value) { return value; });
        console.log({ fats })
    }

    return (
        <div className='concubine-container'>
            {/*<button onClick={Bul}>Tıkla</button>
*/}
            <div className='list-alt concubineTable'>
                <ConcubineList select={{ selects, setSelects }} getCompanyConcubineLoading={getCompanyConcubineLoading} />
            </div>

        </div>
    );
}

export default CompanyConcubinePage;