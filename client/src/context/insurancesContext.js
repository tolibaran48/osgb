import React, { useReducer, createContext } from 'react';

const initialState = {
    insurances: [],
    selectedId: null,
    selectedInsurance: null,
    isLoading: false
}

const InsurancesContext = createContext({
    insurances: [],
    selectedId: null,
    selectedInsurance: null,
    isLoading: false,
    updateInsuranceCompanyName: (company) => { },
    getInsurances: (insurancesData) => { },
    addInsurance: (insuranceData) => { },
    updateInsurance: (insuranceData) => { },
    selectInsurance: (insuranceId) => { },
    updateSelectedInsurance: (insuranceData) => { },
    insuranceLoading: (loadingValue) => { },
    resetInsurancePage: () => { }
})

function insurancesReducer(state, action) {
    switch (action.type) {
        case 'ADD_INSURANCE':
            return {
                ...state,
                insurances: [...state.insurances, action.payload],
                isLoading: false
            }
        case 'UPDATE_INSURANCE':
            return {
                ...state,
                insurances: [...state.insurances.map((insurance) => insurance._id === action.payload._id ? action.payload : insurance)],
                isLoading: false
            }
        case 'UPDATE_INSURANCE_COMPANY_NAME':
            return {
                ...state,
                insurances: [...state.insurances.map((insurance) => insurance.company === action.payload._id ? { ...insurance, companyName: action.payload.name } : insurance)],
            }
        case 'GET_INSURANCES':
            return {
                ...state,
                insurances: action.payload,
                isLoading: false
            }
        case 'SELECT_INSURANCE':
            return {
                ...state,
                selectedId: action.payload,
                selectedInsurance: state.insurances.find(insurance => insurance._id === action.payload)
            }
        case 'UPDATE_SELECTED_INSURANCE':
            const { _id, insuranceNumber, adress, workingStatus, descriptiveName } = action.payload;
            return {
                ...state,
                selectedInsurance: { ...state.selectedInsurance, _id, insuranceNumber, adress, workingStatus, descriptiveName }
            }
        case 'INSURANCE_LOADING':
            return {
                ...state, isLoading: action.payload
            };
        case 'RESET_INSURANCE_PAGE':
            return {
                insurances: [],
                selectedId: null,
                selectedInsurance: null,
                isLoading: false
            }
        default:
            return state
    }
}

function InsurancesProvider(props) {
    const [state, dispatch] = useReducer(insurancesReducer, initialState);

    const getInsurances = (insurancesData) => {
        dispatch({
            type: 'GET_INSURANCES',
            payload: insurancesData
        })
    }

    const addInsurance = (_insurance) => {
        const insurance = {
            ..._insurance,
            companyName: _insurance.companyObjName,
        }
        dispatch({
            type: 'ADD_INSURANCE',
            payload: insurance
        })
    }

    const updateInsurance = (_insurance) => {
        const insurance = {
            ..._insurance,
            companyName: _insurance.companyObjName,
        }
        dispatch({
            type: 'UPDATE_INSURANCE',
            payload: insurance
        })
    }

    const updateInsuranceCompanyName = (company) => {
        dispatch({
            type: 'UPDATE_INSURANCE_COMPANY_NAME',
            payload: company
        })
    }

    const selectInsurance = (insuranceId) => {
        dispatch({
            type: 'SELECT_INSURANCE',
            payload: insuranceId
        })
    }

    const updateSelectedInsurance = (insuranceData) => {
        dispatch({
            type: 'UPDATE_SELECTED_INSURANCE',
            payload: insuranceData
        })
    }

    const insuranceLoading = (loadingValue) => {
        dispatch({
            type: 'INSURANCE_LOADING',
            payload: loadingValue
        })
    }

    const resetInsurancePage = () => {
        dispatch({
            type: 'RESET_INSURANCE_PAGE'
        })
    }

    return (
        <InsurancesContext.Provider
            value={{ insuranceState: state, getInsurances, addInsurance, updateInsurance, updateInsuranceCompanyName, insuranceLoading, selectInsurance, updateSelectedInsurance, resetInsurancePage }}
            {...props}
        />
    )
}

export { InsurancesContext, InsurancesProvider }