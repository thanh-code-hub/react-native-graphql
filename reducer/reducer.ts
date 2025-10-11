import { Action, AppState } from '@/types/types'

export default function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'SIGN_IN':
            return {
                ...state,
                isSignedIn: true,
                token: action.payload.token!
            }
        case 'SIGN_OUT':
            return {
                ...state,
                isSignedIn: false,
                token: ''
            }
        default:
            return state
    }
}
