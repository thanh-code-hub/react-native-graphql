import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { fetchNodes } from '@/apis/graphql'
import HomeScreen from '@/app/main/home'

jest.mock('@fortawesome/react-native-fontawesome', () => ({
    FontAwesomeIcon: ''
}))

jest.mock('@/apis/graphql', () => ({
    fetchNodes: jest.fn()
}))

describe('Home screen: infinite scroll', () => {
    const mockInitialResponse = {
        listProfileNodes: {
            nodes: [
                { id: '1', name: 'Folder 1', kind: 'FolderNode' },
                { id: '2', name: 'File 1', kind: 'FileNode' }
            ],
            pageInfo: {
                hasNextPage: true,
                endCursor: 'cursor-1'
            }
        }
    }

    const mockNextResponse = {
        listProfileNodes: {
            nodes: [{ id: '3', name: 'File 2', kind: 'FileNode' }],
            pageInfo: {
                hasNextPage: false,
                endCursor: 'cursor-2'
            }
        }
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders loading spinner then displays list items', async () => {
        ;(fetchNodes as jest.Mock).mockResolvedValueOnce(mockInitialResponse)

        const { getAllByTestId, queryAllByTestId } = render(<HomeScreen />)

        // Loading spinner should appear initially
        expect(queryAllByTestId('home-loading-spinner')).toHaveLength(1)

        // Wait for loading to finish
        await waitFor(() => {
            const spinner = queryAllByTestId('home-loading-spinner')
            expect(spinner).toHaveLength(0)
        })

        // Should render list items
        expect(getAllByTestId('collapsible-node')).toHaveLength(2)
    })

    it('fetches more items when reaching the end of the list', async () => {
        ;(fetchNodes as jest.Mock)
            .mockResolvedValueOnce(mockInitialResponse) // initial load
            .mockResolvedValueOnce(mockNextResponse) // pagination

        const { getAllByTestId, getByTestId } = render(<HomeScreen />)

        await waitFor(() =>
            expect(getAllByTestId('collapsible-node')).toHaveLength(2)
        )

        // Simulate scrolling to end
        fireEvent(getByTestId('infinite-list'), 'onEndReached')

        await waitFor(() => {
            expect(fetchNodes).toHaveBeenCalledTimes(2)
            expect(getAllByTestId('collapsible-node')).toHaveLength(3)
        })
    })
})
