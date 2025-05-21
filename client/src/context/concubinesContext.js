import React, { useReducer, createContext } from 'react';

const initialState = {
    concubines: [],
    selectedId: null,
    selectedConcubine: null,
    isLoading: false
}

const ConcubinesContext = createContext({
    concubines: [],
    selectedId: null,
    selectedConcubine: null,
    isLoading: false,
    getConcubines: (concubinesData) => { },
    addConcubine: (concubineData) => { },
    updateConcubine: (concubineData) => { },
    updateConcubineCompanyName: (company) => { },
    resetConcubinePage: () => { },
    selectConcubine: (concubineId) => { },
    resetSelectConcubine: () => { },
    concubineLoading: (loadingValue) => { }
})

function concubinesReducer(state, action) {
    switch (action.type) {
        case 'ADD_CONCUBINE':
            return {
                ...state,
                concubines: [...state.concubines.map((concubine) => concubine._id == action.payload.company._id ?
                    {
                        ...concubine,
                        cariler: [...concubine.cariler, action.payload],
                        toplam:concubine.toplam-action.payload.receive,
                        sonOdeme:concubine.sonOdeme===null||concubine.sonOdeme.processDate<action.payload.processDate?{processDate:action.payload.processDate,receive:action.payload.receive}:concubine.sonOdeme
                    }
                    : concubine)],
                isLoading: false
            }
        case 'UPDATE_CONCUBINE':
            return {
                ...state,
                concubines: [...state.concubines.map((concubine) => concubine._id === action.payload._id ? action.payload : concubine)],
                selectedConcubine: action.payload,
                isLoading: false
            }
        case 'UPDATE_CONCUBINE_COMPANY_NAME':
            return {
                ...state,
                concubines: [...state.concubines.map((concubine) => concubine._id === action.payload._id ? { ...concubine, companyName: { ...concubine.companyName, name: action.payload.name } } : concubine)],
            }
        case 'GET_CONCUBINES':
            return {
                ...state,
                concubines: action.payload,
                isLoading: false
            }
        case 'SELECT_CONCUBINE':
            return {
                ...state,
                selectedId: action.payload,
                selectedConcubine: state.concubines.find(concubine => concubine._id === action.payload)
            }
        case 'RESET_SELECT_CONCUBINE':
            return {
                ...state,
                selectedConcubine: null,
                selectedId: null,
                isLoading: false
            }
        case 'RESET_COMPANY_PAGE':
            return {
                concubines: [],
                selectedId: null,
                selectedConcubine: null,
                isLoading: false
            }
        case 'CONCUBINE_LOADING':
            return {
                ...state, isLoading: action.payload
            };
        default:
            return state
    }
}

function ConcubinesProvider(props) {
    const [state, dispatch] = useReducer(concubinesReducer, initialState);

    const getConcubines = (concubinesData) => {
        dispatch({
            type: 'GET_CONCUBINES',
            payload: concubinesData
        })
    }

    const addConcubine = (concubineData) => {
        dispatch({
            type: 'ADD_CONCUBINE',
            payload: concubineData
        })
    }

    const updateConcubine = (concubineData) => {
        dispatch({
            type: 'UPDATE_CONCUBINE',
            payload: concubineData
        })
    }

    const updateConcubineCompanyName = (company) => {
        dispatch({
            type: 'UPDATE_CONCUBINE_COMPANY_NAME',
            payload: company
        })
    }

    const selectConcubine = (concubineId) => {
        dispatch({
            type: 'SELECT_CONCUBINE',
            payload: concubineId
        })
    }

    const resetSelectConcubine = (concubineId) => {
        dispatch({
            type: 'RESET_SELECT_CONCUBINE'
        })
    }

    const resetConcubinePage = () => {
        dispatch({
            type: 'RESET_CONCUBINE_PAGE',
        })
    }

    const concubineLoading = (loadingValue) => {
        dispatch({
            type: 'CONCUBINE_LOADING',
            payload: loadingValue
        })
    }

    return (
        <ConcubinesContext.Provider
            value={{ concubineState: state, getConcubines, addConcubine, updateConcubine, updateConcubineCompanyName, concubineLoading, selectConcubine, resetConcubinePage, resetSelectConcubine }}
            {...props}
        />
    )
}

export { ConcubinesContext, ConcubinesProvider }