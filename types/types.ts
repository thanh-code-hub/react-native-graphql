export type ActionType = 'SIGN_IN' | 'SIGN_OUT'

export type Action = {
    type: ActionType
    payload?: Partial<AppState>
}

export type AppState = {
    isSignedIn: boolean
}

export type LoginData = {
    username: string
    password: string
}
