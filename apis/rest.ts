import { LoginData } from '@/types/types'
import { deleteItemAsync, getItemAsync } from 'expo-secure-store'

const authURL: string | undefined = process.env.EXPO_PUBLIC_AUTH_URL

export async function login({ username, password }: LoginData) {
    if (!authURL) {
        throw new Error('Missing auth URL')
    }
    const res = await fetch(`${authURL}/generate-token`, {
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
    if (!token) {
        return
    }

    const res = await fetch(`${authURL}/sign-out`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${JSON.parse(token).access_token}`
        }
    })
    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Invalid credentials')
    }
    await deleteItemAsync('auth')
    return true
}
