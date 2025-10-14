const graphqlURL = process.env.EXPO_PUBLIC_GRAPHQL_URL!

export async function fetchNodes(
    token: string,
    afterCursor: string | null = null,
    filter?: object
) {
    const query = `query ListProfileNodes($first: Int, $after: String, $where: ProfileNodeFilterInput, $order: [ProfileNodeSortInput!]) {
          listProfileNodes(first: $first, after: $after, where: $where, order: $order) {
                nodes {
                      id
                      name
                      kind
                      parentNodeId
                      ... on VideoChannelNode {
                            componentId
                      }
                      ... on DigitalInputNode {
                            componentId
                      }
                      ... on DigitalOutputNode {
                            componentId
                      }
                }
                pageInfo {
                      hasNextPage
                      endCursor
                }
          }
    }`

    const res = await fetch(graphqlURL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'X-WG-TRACE': 'true'
        },
        body: JSON.stringify({
            query,
            variables: {
                first: 50,
                after: afterCursor || undefined,
                where: filter ? { ...filter } : undefined
            }
        })
    })

    if (!res.ok) {
        throw new Error('Failed to fetch nodes')
    }
    return res.json().then((res) => res.data)
}
