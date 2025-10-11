export type ProfileNode = {
    id: string
    kind: string
    name: string
    parentNodeId: string | null
}

export type PageInfo = {
    hasNextPage: boolean
    endCursor: string | null
}

export type ListProfileNodes = {
    listProfileNodes: {
        nodes: ProfileNode[]
    }
    pageInfo: PageInfo
}
