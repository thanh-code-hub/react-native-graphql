import { FlatList, StyleSheet, Text } from 'react-native'
import { useAppContext } from '@/context-provider/provider'
import { useEffect, useState } from 'react'
import { ProfileNode } from '@/types/dataTypes'
import { fetchNodes } from '@/utils/utils'
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

    const filter = parentNodeId
        ? {
              parentNodeId: {
                  eq: parentNodeId
              }
          }
        : undefined

    useEffect(() => {
        fetchNodes(token, null, filter).then((res) => {
            setData(res.listProfileNodes.nodes)
            setHasNextPage(res.listProfileNodes.pageInfo.hasNextPage)
            setEndCursor(res.listProfileNodes.pageInfo.endCursor)
        })
    }, [])

    return (
        data && (
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
                ListEmptyComponent={<Text>Nothing to show</Text>}
                onEndReached={() => {
                    hasNextPage &&
                        fetchNodes(token, endCursor, filter).then((res) => {
                            setData([...data, ...res.listProfileNodes.nodes])
                            setEndCursor(
                                res.listProfileNodes.pageInfo.endCursor
                            )
                            setHasNextPage(
                                res.listProfileNodes.pageInfo.hasNextPage
                            )
                        })
                }}
                style={styles.container}
            ></FlatList>
        )
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16
    }
})
