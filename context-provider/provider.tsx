import { createContext, useContext, useReducer, ReactNode } from 'react'
import { Action, AppState } from '@/types/types'
import reducer from '@/reducer/reducer'

const defaultState: AppState = {
    isSignedIn: false
}

const AppContext = createContext<AppState>(defaultState)
const AppContextDispatch = createContext<(action: Action) => void>(() => {})

export function AppContextProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, defaultState)

    return (
        <AppContext value={{ isSignedIn: state.isSignedIn }}>
            <AppContextDispatch value={dispatch}>{children}</AppContextDispatch>
        </AppContext>
    )
}

export const useAppContext = () => useContext(AppContext)
export const useAppContextDispatch = () => useContext(AppContextDispatch)
