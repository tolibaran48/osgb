import React, { useReducer, createContext } from 'react';

const initialState = {
    activeUser: {
        user: null,
        isAuthenticated: false,
        isLoading:true,
        token: null
    }

}

const AuthContext = createContext({
    activeUser: {
        user: null,
        isAuthenticated: false,
        isLoading:true,
        token: null
    },
    signIn: (userData) => { },
    signOut: () => { },
    loadUser:()=>{ },
    loading:()=>{}
})

function authReducer(state, action) {
    switch (action.type) {
        case 'USER_LOADED':
            return {
                ...state,
                activeUser: { ...state.activeUser, isAuthenticated: true, isLoading: false, token: action.payload.token, user: action.payload.user }
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                activeUser: { ...state.activeUser, isAuthenticated: true, isLoading: false, token: action.payload.token, user: action.payload.user }
            };

        case 'LOGOUT_SUCCESS':

            return {
                ...state,
                activeUser: { ...state.activeUser, isAuthenticated: false, isLoading: false, token: null, user: null }
            };
        case 'LOADING':

            return {
                ...state,
                activeUser: { ...state.activeUser, isLoading: action.payload }
            };
        case 'AUTH_ERROR':
        case 'LOGIN_FAIL':
            return {
                ...state,
                activeUser: { ...state.activeUser, isAuthenticated: false }
            };
        default:
            return state
    }
}

function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const signIn = (userData) => {
        localStorage.setItem('token',userData.token);
        dispatch({
            type:'LOGIN_SUCCESS',
            payload:userData
        })
    }

    const signOut = () => {
        localStorage.removeItem('token');
         dispatch({
            type:'LOGOUT_SUCCESS'
        })
    }

    const loadUser = (userData) => {
        if (userData.activeUser) {
            dispatch({
                type: 'USER_LOADED',
                payload: userData.activeUser
            })
        }
        else{
            dispatch({
                type: 'LOADING',
                payload: false
            })
        }
    }

    const loading = (value) => {
        dispatch({
            type: 'LOADING',
            payload: value
        })
    }

    return (
        <AuthContext.Provider
            value={{ activeUser: state.activeUser, signIn, signOut, loadUser, loading }}
            {...props}
        />
    )
}

export { AuthContext, AuthProvider }