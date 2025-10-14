import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import UserScreen from '@/app/main/user'
import { useAppContextDispatch } from '@/context-provider/provider'
import { logout } from '@/apis/rest'
import { useMutation, useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'

jest.mock('expo-router', () => ({
    router: { push: jest.fn() }
}))

jest.mock('@/context-provider/provider', () => ({
    useAppContextDispatch: jest.fn()
}))

jest.mock('@/apis/rest', () => ({
    logout: jest.fn()
}))

jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
    useMutation: jest.fn()
}))

describe('UserScreen', () => {
    const mockDispatch = jest.fn()
    const mockLogout = jest.fn()
    const mockRouterPush = router.push as jest.Mock

    beforeEach(() => {
        jest.clearAllMocks()
        ;(useAppContextDispatch as jest.Mock).mockReturnValue(mockDispatch)
        ;(logout as jest.Mock).mockImplementation(mockLogout)
    })

    it('shows loading spinner when fetching user data', () => {
        ;(useQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false
        })
        ;(useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isPending: false,
            isError: false,
            error: {}
        })

        const { getByTestId } = render(<UserScreen />)

        expect(getByTestId('user-loading-spinner')).toBeTruthy()
    })

    it('renders user data when fetch is successful', () => {
        ;(useQuery as jest.Mock).mockReturnValue({
            data: {
                username: 'john_doe',
                publicName: 'John',
                language: 'English'
            },
            isLoading: false,
            isError: false
        })
        ;(useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isPending: false,
            isError: false,
            error: {}
        })

        const { getByText } = render(<UserScreen />)

        expect(getByText('Username: john_doe')).toBeTruthy()
        expect(getByText('Public name: John')).toBeTruthy()
        expect(getByText('Language: English')).toBeTruthy()
    })

    it('shows error message when fetching user data fails', () => {
        ;(useQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true
        })
        ;(useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isPending: false,
            isError: false,
            error: {}
        })

        const { getByText } = render(<UserScreen />)

        expect(getByText('Failed to fetch user data.')).toBeTruthy()
    })

    it('calls logout mutation on logout button press', async () => {
        const mockMutate = jest.fn()
        ;(useQuery as jest.Mock).mockReturnValue({
            data: { username: 'test', publicName: 'Tester', language: 'EN' },
            isLoading: false,
            isError: false
        })
        ;(useMutation as jest.Mock).mockReturnValue({
            mutate: mockMutate,
            isPending: false,
            isError: false,
            error: {}
        })

        const { getByText } = render(<UserScreen />)

        fireEvent.press(getByText('Logout'))

        expect(mockMutate).toHaveBeenCalled()
    })

    it('shows loading spinner when logout is pending', () => {
        ;(useQuery as jest.Mock).mockReturnValue({
            data: { username: 'test', publicName: 'Tester', language: 'EN' },
            isLoading: false,
            isError: false
        })
        ;(useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isPending: true,
            isError: false,
            error: {}
        })

        const { getByTestId } = render(<UserScreen />)
        expect(getByTestId('logout-loading-spinner')).toBeTruthy()
    })

    it('dispatches SIGN_OUT and navigates to root on logout success', async () => {
        ;(useQuery as jest.Mock).mockReturnValue({
            data: { username: 'user', publicName: 'User', language: 'EN' },
            isLoading: false,
            isError: false
        })

        // simulate mutation with onSuccess callback
        ;(useMutation as jest.Mock).mockImplementation(({ onSuccess }) => ({
            mutate: () => onSuccess(),
            isPending: false,
            isError: false,
            error: {}
        }))

        const { getByText } = render(<UserScreen />)
        fireEvent.press(getByText('Logout'))

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({ type: 'SIGN_OUT' })
            expect(mockRouterPush).toHaveBeenCalledWith('/')
        })
    })

    it('shows error message when logout mutation fails', () => {
        ;(useQuery as jest.Mock).mockReturnValue({
            data: { username: 'user', publicName: 'User', language: 'EN' },
            isLoading: false,
            isError: false
        })
        ;(useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isPending: false,
            isError: true,
            error: { message: 'Logout failed' }
        })

        const { getByText } = render(<UserScreen />)
        expect(getByText('Logout failed')).toBeTruthy()
    })
})
