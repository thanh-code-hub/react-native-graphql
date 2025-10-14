import { LoginData } from '@/types/types'
import { deleteItemAsync, getItemAsync } from 'expo-secure-store'

const authURL: string | undefined = process.env.EXPO_PUBLIC_AUTH_URL

export async function login({ username, password }: LoginData) {
    if (!authURL) {
        throw new Error('Missing auth URL')
    }
    const res = await fetch(`${authURL}/auth/generate-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })

    if (!res.ok) {
        const error = await res.json()
        console.error(JSON.stringify(error, null, 2))
        throw new Error('Invalid credentials')
    }

    return res.json().then((res) => res.data)
}

export async function logout() {
    const token = await getItemAsync('auth')
    if (!token) {
        return
    }

    const res = await fetch(`${authURL}/auth/sign-out`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${JSON.parse(token).access_token}`
        }
    })
    if (!res.ok) {
        const error = await res.json()
        console.error(JSON.stringify(error, null, 2))
        throw new Error('Failed to logout')
    }
    await deleteItemAsync('auth')
    return true
}

export async function fetchUserData() {
    const token = await getItemAsync('auth')

    if (!token) {
        throw new Error('Invalid credentials')
    }

    const res = await fetch(`${authURL}/users/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + JSON.parse(token).access_token
        }
    })

    if (!res.ok) {
        const error = await res.json()
        console.error(JSON.stringify(error, null, 2))
        throw new Error('Failed to fetch user data')
    }

    return res.json().then((res) => res.data)
}
