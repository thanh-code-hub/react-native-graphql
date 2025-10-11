import { Button, ScrollView, Text } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { router } from 'expo-router'
import { useAppContext } from '@/context-provider/provider'
import CollapsibleNode from '@/components/collapsibleNode'
import { fetchNodes } from '@/utils/utils'
import { useQuery } from '@tanstack/react-query'

export default function HomeScreen() {
    const { token } = useAppContext()

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['profileNode'],
        queryFn: () => fetchNodes(token)
    })

    console.log('data', data)

    isError && console.log(error)

    return (
        <ScrollView>
            {isLoading && <Text>Loading....</Text>}
            {data ? (
                data.listProfileNodes.nodes.map((node) => (
                    <CollapsibleNode
                        key={node.id}
                        node={node}
                        collapsible={node.kind === 'FolderNode'}
                    />
                ))
            ) : (
                <Text>Nothing to show</Text>
            )}
            <Button
                onPress={async () => {
                    await SecureStore.deleteItemAsync('auth')
                    router.push('/')
                }}
                title="Logout"
            />
        </ScrollView>
    )
}
