import { useEffect, useState } from 'react'
import { ProfileNode } from '@/types/dataTypes'
import { fetchNodes } from '@/apis/graphql'
import { ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native'
import CollapsibleNode from '@/components/collapsibleNode'
import globalStyles from '@/styles/styles'

export default function HomeScreen() {
    const [data, setData] = useState<ProfileNode[]>([])
    const [endCursor, setEndCursor] = useState<string>('')
    const [hasNextPage, setHasNextPage] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)

    const fetchNodeData = (endCursor?: string) => {
        setIsLoading(true)
        setTimeout(() => {
            fetchNodes(endCursor)
                .then((res) => {
                    setData([...data, ...res.listProfileNodes.nodes])
                    setHasNextPage(res.listProfileNodes.pageInfo.hasNextPage)
                    setEndCursor(res.listProfileNodes.pageInfo.endCursor)
                })
                .catch((e: string) => {
                    console.error(e)
                    setIsError(true)
                })
                .then(() => {
                    setIsLoading(false)
                })
        }, 500) //to slow thing down so you can see the loading spinner, may affect unit testing
    }

    useEffect(() => {
        fetchNodeData()
    }, [])

    return (
        <>
            <FlatList
                testID="infinite-list"
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CollapsibleNode
                        node={item}
                        collapsible={item.kind === 'FolderNode'}
                    />
                )}
                progressViewOffset={20}
                ListEmptyComponent={
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 16
                        }}
                    >
                        Nothing to show
                    </Text>
                }
                onEndReached={() => {
                    if (hasNextPage) {
                        fetchNodeData(endCursor)
                    }
                }}
                style={styles.container}
            />
            {isError && (
                <Text style={globalStyles.errorText}>
                    Something went wrong while fetching node data
                </Text>
            )}
            <ActivityIndicator
                testID={'home-loading-spinner'}
                size={'large'}
                animating={isLoading}
                hidesWhenStopped
                style={{
                    zIndex: 100,
                    elevation: 100,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    backgroundColor: isLoading
                        ? 'rgba(166,166,166,0.5)'
                        : 'rgba(166,166,166,0)',
                    width: '100%'
                }}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 50,
        flexGrow: 1,
        backgroundColor: '#fff'
    }
})
