import { LoginData } from '@/types/types'
import { getItemAsync } from 'expo-secure-store'

const authURL: string | undefined = process.env.EXPO_PUBLIC_AUTH_URL

export async function login({ username, password }: LoginData) {
    if (!authURL) {
        throw new Error('Missing auth URL')
    }
    const res = await fetch(authURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Invalid credentials')
    }

    return res.json()
}

export async function logout() {
    const token = await getItemAsync('auth')
    console.log(token)
}
