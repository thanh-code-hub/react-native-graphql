import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View,
    StyleSheet
} from 'react-native'
import { router } from 'expo-router'
import { fetchUserData, logout } from '@/apis/rest'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAppContextDispatch } from '@/context-provider/provider'
import globalStyles from '@/styles/styles'

export default function UserScreen() {
    const dispatch = useAppContextDispatch()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['fetchUserData'],
        queryFn: fetchUserData
    })

    const mutation = useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            dispatch({ type: 'SIGN_OUT' })
            router.push('/')
        },
        onError: (mutationError) => {
            console.error('Mutation error', mutationError.message)
        }
    })

    return (
        <View style={styles.container}>
            {isLoading && <ActivityIndicator testID={'user-loading-spinner'} />}
            {data && (
                <View>
                    <Text style={styles.content}>
                        Username: {data.username}
                    </Text>
                    <Text style={styles.content}>
                        Public name: {data.publicName}
                    </Text>
                    <Text style={styles.content}>
                        Language: {data.language}
                    </Text>
                </View>
            )}
            {isError && (
                <Text style={globalStyles.errorText}>
                    Failed to fetch user data.
                </Text>
            )}
            <TouchableOpacity
                disabled={mutation.isPending}
                style={[
                    globalStyles.button,
                    {
                        backgroundColor: mutation.isPending
                            ? 'rgba(142,142,142,0.5)'
                            : 'rgb(108 194 74)',
                        marginBottom: 50
                    }
                ]}
                onPress={() => {
                    mutation.mutate()
                }}
            >
                {mutation.isPending ? (
                    <ActivityIndicator testID={'logout-loading-spinner'} />
                ) : (
                    <Text style={[globalStyles.buttonText, { color: 'white' }]}>
                        {' '}
                        Logout{' '}
                    </Text>
                )}
            </TouchableOpacity>
            {mutation.isError && (
                <Text style={globalStyles.errorText}>
                    {mutation.error.message}
                </Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        height: '100%',
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    content: {
        fontSize: 24,
        paddingVertical: 4
    }
})
