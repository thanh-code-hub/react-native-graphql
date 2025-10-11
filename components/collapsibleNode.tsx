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

    const handleClick = (filter: object) => {
        console.log('click', node.name)
        fetchNodes(token, {
            ...filter
        }).then((data) => {
            setData(data)
        })
    }

    return (
        <>
            <TouchableOpacity
                disabled={!collapsible}
                style={styles.button}
                onPress={() => {
                    handleClick({
                        parentNodeId: {
                            eq: node.id
                        }
                    })
                }}
            >
                <Text style={styles.title}>{node.name}</Text>
            </TouchableOpacity>
            {collapsible && data && (
                <View style={styles.childContainer}>
                    {data.listProfileNodes.nodes.map((node: ProfileNode) => (
                        <CollapsibleNode
                            key={node.id}
                            node={node}
                            collapsible={node.kind === 'FolderNode'}
                        />
                    ))}
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 8
    },
    title: {
        fontSize: 18
    },
    childContainer: {
        paddingVertical: 8,
        paddingHorizontal: 8
    }
})
