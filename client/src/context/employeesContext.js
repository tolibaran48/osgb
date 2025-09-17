import React, { useReducer, createContext } from 'react';

const initialState = {
    employees: [],
    selectedId: null,
    selectedEmployee: null,
    isLoading: false
}

const EmployeesContext = createContext({
    employees: [],
    selectedId: null,
    selectedEmployee: null,
    isLoading: false,
    getEmployees: (employeesData) => { },
    addEmployee: (employeeData) => { },
    updateEmployee: (employeeData) => { },
    selectEmployee: (employeeId) => { },
    resetSelectEmployee: () => { },
    resetEmployeePage: () => { },
    employeeLoading: (loadingValue) => { }
})


function employeesReducer(state, action) {
    switch (action.type) {
        case 'ADD_EMPLOYEE':
            return {
                ...state,
                employees: [...state.employees, action.payload],
                isLoading: false
            }
        case 'UPDATE_EMPLOYEE':
            return {
                ...state,
                userscompanies: [...state.employees.map((employee) => employee._id === action.payload._id ? action.payload : employee)],
                selectedUser: action.payload,
                isLoading: false
            }
        case 'GET_EMPLOYEES':
            return {
                ...state,
                employees: action.payload,
                isLoading: false
            }
        case 'SELECT_EMPLOYEE':
            return {
                ...state,
                selectedId: action.payload,
                selectedEmployee: state.employees.find(employee => employee._id === action.payload)
            }
        case 'RESET_SELECT_EMPLOYEE':
            return {
                ...state,
                selectedEmployee: null,
                selectedId: null,
                isLoading: false
            }
        case 'RESET_EMPLOYEE_PAGE':
            return {
                employees: [],
                selectedId: null,
                selectedCompany: null,
                isLoading: false
            }
        case 'EMPLOYEE_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };
        default:
            return state
    }
}

function EmployeesProvider(props) {
    try {
        const [state, dispatch] = useReducer(employeesReducer, initialState);

        const getEmployees = (employeesData) => {
            dispatch({
                type: 'GET_EMPLOYEES',
                payload: employeesData
            })
        }

        const addEmployee = (employeeData) => {
            dispatch({
                type: 'ADD_EMPLOYEE',
                payload: employeeData
            })
        }

        const updateEmployee = (employeeData) => {
            dispatch({
                type: 'UPDATE_EMPLOYEE',
                payload: employeeData
            })
        }

        const selectEmployee = (employeeId) => {
            dispatch({
                type: 'SELECT_EMPLOYEE',
                payload: employeeId
            })
        }

        const resetSelectEmployee = (employeeId) => {
            dispatch({
                type: 'RESET_SELECT_EMPLOYEE'
            })
        }

        const resetEmployeePage = () => {
            dispatch({
                type: 'RESET_EMPLOYEE_PAGE',
            })
        }

        const employeeLoading = (loadingValue) => {
            dispatch({
                type: 'EMPLOYEE_LOADING',
                payload: loadingValue
            })
        }

        return (
            <EmployeesContext.Provider
                value={{ employeeState: state, getEmployees, addEmployee, updateEmployee, employeeLoading, selectEmployee, resetEmployeePage, resetSelectEmployee }}
                {...props}
            />
        )
    } catch (error) {
        console.log(error)
    }

}

export { EmployeesContext, EmployeesProvider }