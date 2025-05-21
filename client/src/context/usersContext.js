import React, { useReducer, createContext } from 'react';

const initialState = {
    users: [],
    selectedId: null,
    selectedUser: null,
    isLoading: false
}

const UsersContext = createContext({
    users: [],
    selectedId: null,
    selectedUser: null,
    isLoading: false,
    getUsers: (usersData) => { },
    addUser: (userData) => { },
    updateUser: (userData) => { },
    selectUser: (companyId) => { },
    resetSelectUser: () => { },
    resetUserPage: () => { },
    userLoading: (loadingValue) => { }
})

function usersReducer(state, action) {
    switch (action.type) {
        case 'ADD_USER':
            return {
                ...state,
                users: [...state.users, action.payload],
                isLoading: false
            }
        case 'UPDATE_USER':
            return {
                ...state,
                userscompanies: [...state.users.map((user) => user._id === action.payload._id ? action.payload : user)],
                selectedUser: action.payload,
                isLoading: false
            }
        case 'GET_USERS':
            return {
                ...state,
                users: action.payload,
                isLoading: false
            }
        case 'SELECT_USER':
            return {
                ...state,
                selectedId: action.payload,
                selectedUser: state.users.find(user => user._id === action.payload)
            }
        case 'RESET_SELECT_USER':
            return {
                ...state,
                selectedUser: null,
                selectedId: null,
                isLoading: false
            }
        case 'RESET_USER_PAGE':
            return {
                users: [],
                selectedId: null,
                selectedCompany: null,
                isLoading: false
            }
        case 'USER_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };
        default:
            return state
    }
}

function UsersProvider(props) {
    const [state, dispatch] = useReducer(usersReducer, initialState);

    const getUsers = (usersData) => {
        dispatch({
            type: 'GET_USERS',
            payload: usersData
        })
    }

    const addUser = (userData) => {
        dispatch({
            type: 'ADD_USER',
            payload: userData
        })
    }

    const updateUser = (userData) => {
        dispatch({
            type: 'UPDATE_USER',
            payload: userData
        })
    }

    const selectUser = (userId) => {
        dispatch({
            type: 'SELECT_USER',
            payload: userId
        })
    }

    const resetSelectUser = (userId) => {
        dispatch({
            type: 'RESET_SELECT_USER'
        })
    }

    const resetUserPage = () => {
        dispatch({
            type: 'RESET_USER_PAGE',
        })
    }

    const userLoading = (loadingValue) => {
        dispatch({
            type: 'USER_LOADING',
            payload: loadingValue
        })
    }

    return (
        <UsersContext.Provider
            value={{ userState: state, getUsers, addUser, updateUser, userLoading, selectUser, resetUserPage, resetSelectUser }}
            {...props}
        />
    )
}

export { UsersContext, UsersProvider }