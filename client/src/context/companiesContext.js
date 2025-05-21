import React, { useReducer, createContext } from 'react';

const initialState = {
    companies: [],
    selectedId: null,
    selectedCompany: null,
    isLoading: false
}

const CompaniesContext = createContext({
    companies: [],
    selectedId: null,
    selectedCompany: null,
    isLoading: false,
    getCompanies: (companiesData) => { },
    addCompany: (companyData) => { },
    updateCompany: (companyData) => { },
    resetCompanyPage: () => { },
    selectCompany: (companyId) => { },
    resetSelectCompany: () => { },
    companyLoading: (loadingValue) => { }
})

function companiesReducer(state, action) {
    switch (action.type) {
        case 'ADD_COMPANY':
            return {
                ...state,
                companies: [...state.companies, action.payload],
                isLoading: false
            }
        case 'UPDATE_COMPANY':
            return {
                ...state,
                companies: [...state.companies.map((company) => company._id === action.payload._id ? action.payload : company)],
                selectedCompany: action.payload,
                isLoading: false
            }
        case 'GET_COMPANIES':
            return {
                ...state,
                companies: action.payload,
                isLoading: false
            }
        case 'SELECT_COMPANY':
            return {
                ...state,
                selectedId: action.payload,
                selectedCompany: state.companies.find(company => company._id === action.payload)
            }
        case 'RESET_SELECT_COMPANY':
            return {
                ...state,
                selectedCompany: null,
                selectedId: null,
                isLoading: false
            }
        case 'RESET_COMPANY_PAGE':
            return {
                companies: [],
                selectedId: null,
                selectedCompany: null,
                isLoading: false
            }
        case 'COMPANY_LOADING':
            return {
                ...state, isLoading: action.payload
            };
        default:
            return state
    }
}

function CompaniesProvider(props) {
    const [state, dispatch] = useReducer(companiesReducer, initialState);

    const getCompanies = (companiesData) => {
        dispatch({
            type: 'GET_COMPANIES',
            payload: companiesData
        })
    }

    const addCompany = (companyData) => {
        dispatch({
            type: 'ADD_COMPANY',
            payload: companyData
        })
    }

    const updateCompany = (companyData) => {
        dispatch({
            type: 'UPDATE_COMPANY',
            payload: companyData
        })
    }

    const selectCompany = (companyId) => {
        dispatch({
            type: 'SELECT_COMPANY',
            payload: companyId
        })
    }

    const resetSelectCompany = (companyId) => {
        dispatch({
            type: 'RESET_SELECT_COMPANY'
        })
    }

    const resetCompanyPage = () => {
        dispatch({
            type: 'RESET_COMPANY_PAGE',
        })
    }

    const companyLoading = (loadingValue) => {
        dispatch({
            type: 'COMPANY_LOADING',
            payload: loadingValue
        })
    }

    return (
        <CompaniesContext.Provider
            value={{ companyState: state, getCompanies, addCompany, updateCompany, companyLoading, selectCompany, resetCompanyPage, resetSelectCompany }}
            {...props}
        />
    )
}

export { CompaniesContext, CompaniesProvider }