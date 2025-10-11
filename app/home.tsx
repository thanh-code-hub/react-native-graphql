import { Button, ScrollView, Text } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { router } from 'expo-router'
import { useAppContext } from '@/context-provider/provider'
import CollapsibleNode from '@/components/collapsibleNode'
import { fetchNodes } from '@/utils/utils'
import { useQuery } from '@tanstack/react-query'

export default function HomeScreen() {
    const { token } = useAppContext()

    const { data, isLoading } = useQuery({
        queryKey: ['profileNode'],
        queryFn: () => fetchNodes(token)
    })

    return (
        <ScrollView>
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
            {isLoading && <Text>Loading...</Text>}
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
