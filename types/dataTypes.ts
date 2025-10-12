export type ProfileNode = {
    id: string
    kind: string
    name: string
    parentNodeId: string | null
}

export type PageInfo = {
    hasNextPage: boolean
    endCursor: string | undefined
}

export type ListProfileNodes = {
    listProfileNodes: {
        nodes: ProfileNode[]
        pageInfo: PageInfo
    }
}
