import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { ListProfileNodes, ProfileNode } from '@/types/dataTypes'
import { useState } from 'react'
import { fetchNodes } from '@/apis/graphql'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { icons } from '@/constants/icons'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

type CollapsibleNodeProps = {
    node: ProfileNode
    collapsible: boolean
}

export default function CollapsibleNode(props: CollapsibleNodeProps) {
    const { node, collapsible } = props
    const [data, setData] = useState<ListProfileNodes | undefined>()
    const [isLoading, setIsLoading] = useState(false)
    const [collapsed, setCollapsed] = useState(true)

    const handleClick = (filter: object) => {
        setIsLoading(true)
        fetchNodes(null, {
            ...filter
        }).then((data) => {
            setTimeout(() => {
                setData(data)
                setIsLoading(false)
            }, 200) //to slow thing down so you can see the loading spinner
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
                <FontAwesomeIcon
                    icon={(icons[node.kind] || faQuestion) as IconProp}
                />
                <Text style={styles.title}>{node.name}</Text>
            </TouchableOpacity>
            {!collapsed && collapsible && data && !isLoading && (
                // Perhaps an InfiniteList here too ?
                <View style={styles.childContainer}>
                    {data.listProfileNodes.nodes.length ? (
                        data.listProfileNodes.nodes.map((node: ProfileNode) => (
                            <CollapsibleNode
                                key={node.id}
                                node={node}
                                collapsible={node.kind === 'FolderNode'}
                            />
                        ))
                    ) : (
                        <Text>Nothing to show</Text>
                    )}
                </View>
            )}
            {isLoading && <ActivityIndicator />}
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        marginLeft: 16
    },
    childContainer: {
        paddingHorizontal: 16
    }
})
