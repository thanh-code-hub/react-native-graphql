import { ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native'
import { useAppContext } from '@/context-provider/provider'
import { useEffect, useMemo, useState } from 'react'
import { ProfileNode } from '@/types/dataTypes'
import { fetchNodes } from '@/apis/graphql'
import CollapsibleNode from '@/components/collapsibleNode'

export default function InfiniteList({
    parentNodeId
}: {
    parentNodeId?: string
}) {
    const { token } = useAppContext()
    const [data, setData] = useState<ProfileNode[] | undefined>()
    const [endCursor, setEndCursor] = useState<string>('')
    const [hasNextPage, setHasNextPage] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const filter = useMemo(
        () =>
            parentNodeId
                ? {
                      parentNodeId: {
                          eq: parentNodeId
                      }
                  }
                : undefined,
        [parentNodeId]
    )

    useEffect(() => {
        setIsLoading(true)
        fetchNodes(token, null, filter).then((res) => {
            setTimeout(() => {
                setData(res.listProfileNodes.nodes)
                setHasNextPage(res.listProfileNodes.pageInfo.hasNextPage)
                setEndCursor(res.listProfileNodes.pageInfo.endCursor)
                setIsLoading(false)
            }, 200) //to slow thing down so you can see the loading spinner
        })
    }, [token, filter])

    return (
        <>
            {data && !isLoading && (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CollapsibleNode
                            node={item}
                            collapsible={item.kind === 'FolderNode'}
                        />
                    )}
                    progressViewOffset={1}
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
                        hasNextPage &&
                            fetchNodes(token, endCursor, filter).then((res) => {
                                setData([
                                    ...data,
                                    ...res.listProfileNodes.nodes
                                ])
                                setEndCursor(
                                    res.listProfileNodes.pageInfo.endCursor
                                )
                                setHasNextPage(
                                    res.listProfileNodes.pageInfo.hasNextPage
                                )
                            })
                    }}
                    style={styles.container}
                />
            )}
            {isLoading && <ActivityIndicator />}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16
    }
})
