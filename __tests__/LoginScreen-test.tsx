import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import LoginScreen from '@/app/index'
import { useAppContextDispatch } from '@/context-provider/provider'
import { login } from '@/apis/rest'

jest.mock('expo-router', () => ({
    router: { push: jest.fn() }
}))
jest.mock('expo-secure-store', () => ({
    setItemAsync: jest.fn()
}))
jest.mock('@/context-provider/provider', () => ({
    useAppContextDispatch: jest.fn()
}))
jest.mock('@/apis/rest', () => ({
    loginUser: jest.fn()
}))
jest.mock('@tanstack/react-query', () => ({
    useMutation: jest.fn().mockImplementation(() => ({
        mutate: jest.fn(),
        isError: false,
        error: {}
    }))
}))

describe('LoginScreen', () => {
    const mockDispatch = jest.fn()
    const mockLogin = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
        ;(useAppContextDispatch as jest.Mock).mockReturnValue(mockDispatch)
        ;(login as jest.Mock).mockImplementation(mockLogin)
    })

    it('renders login form correctly', () => {
        const { getByPlaceholderText, getAllByText } = render(<LoginScreen />)

        expect(getAllByText('Login')).toHaveLength(2)
        expect(getByPlaceholderText('username')).toBeTruthy()
        expect(getByPlaceholderText('Password')).toBeTruthy()
    })

    it('shows validation errors when fields are empty', async () => {
        const { getByTestId, getByText } = render(<LoginScreen />)

        fireEvent.press(getByTestId('login-button'))

        await waitFor(() => {
            expect(getByText('Username is required')).toBeTruthy()
            expect(getByText('Password is required')).toBeTruthy()
        })
    })
})
