import { Action, AppState } from '@/types/types'

export default function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'SIGN_IN':
            return {
                ...state,
                isSignedIn: true
            }
        case 'SIGN_OUT':
            return {
                ...state,
                isSignedIn: false
            }
        default:
            return state
    }
}
