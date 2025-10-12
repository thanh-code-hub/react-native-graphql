import { Button, Text, StyleSheet, FlatList } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { router } from 'expo-router'
import { useAppContext } from '@/context-provider/provider'
import CollapsibleNode from '@/components/collapsibleNode'
import { fetchNodes } from '@/utils/utils'
import { useEffect, useState } from 'react'
import { ProfileNode } from '@/types/dataTypes'

export default function HomeScreen() {
    const { token } = useAppContext()
    const [data, setData] = useState<ProfileNode[] | []>([])
    const [endCursor, setEndCursor] = useState<string>('')
    const [hasNextPage, setHasNextPage] = useState<boolean>(false)

    useEffect(() => {
        fetchNodes(token).then((res) => {
            setData(res.listProfileNodes.nodes)
            setHasNextPage(res.listProfileNodes.pageInfo.hasNextPage)
            setEndCursor(res.listProfileNodes.pageInfo.endCursor)
        })
    }, [])

    return (
        <>
            {data && (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CollapsibleNode
                            node={item}
                            collapsible={item.kind === 'FolderNode'}
                        />
                    )}
                    progressViewOffset={20}
                    ListEmptyComponent={<Text>Nothing to show</Text>}
                    onEndReached={() => {
                        hasNextPage &&
                            fetchNodes(token, endCursor).then((res) => {
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
                ></FlatList>
            )}

            <Button
                onPress={async () => {
                    await SecureStore.deleteItemAsync('auth')
                    router.push('/')
                }}
                title="Logout"
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16
    }
})
