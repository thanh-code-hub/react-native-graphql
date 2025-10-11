import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ListProfileNodes, ProfileNode } from '@/types/dataTypes'
import { useAppContext } from '@/context-provider/provider'
import { useState } from 'react'
import { fetchNodes } from '@/utils/utils'

type CollapsibleNodeProps = {
    node: ProfileNode
    collapsible: boolean
}

export default function CollapsibleNode(props: CollapsibleNodeProps) {
    const { token } = useAppContext()
    const { node, collapsible } = props
    const [data, setData] = useState<ListProfileNodes | undefined>()
    const [isLoading, setIsLoading] = useState(false)
    const [collapsed, setCollapsed] = useState(true)

    const handleClick = (filter: object) => {
        setIsLoading(true)
        fetchNodes(token, {
            ...filter
        }).then((data) => {
            setData(data)
            setIsLoading(false)
        })
    }

    return (
        <>
            <TouchableOpacity
                disabled={!collapsible}
                style={styles.button}
                onPress={() => {
                    if (collapsed) {
                        !data &&
                            handleClick({
                                parentNodeId: {
                                    eq: node.id
                                }
                            })
                    }
                    setCollapsed(!collapsed)
                }}
            >
                <Text style={styles.title}>{node.name}</Text>
            </TouchableOpacity>
            {!collapsed && collapsible && data && (
                <View style={styles.childContainer}>
                    {data.listProfileNodes.nodes.map((node: ProfileNode) => (
                        <CollapsibleNode
                            key={node.id}
                            node={node}
                            collapsible={node.kind === 'FolderNode'}
                        />
                    ))}
                    {isLoading && <Text>Loading...</Text>}
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    title: {
        fontSize: 18
    },
    childContainer: {
        paddingHorizontal: 16
    }
})
