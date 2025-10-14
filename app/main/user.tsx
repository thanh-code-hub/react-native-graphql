import { ActivityIndicator, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { logout } from '@/apis/rest'
import { useMutation } from '@tanstack/react-query'
import { useAppContextDispatch } from '@/context-provider/provider'
import globalStyles from '@/styles/styles'

export default function UserScreen() {
    const dispatch = useAppContextDispatch()

    const mutation = useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            dispatch({ type: 'SIGN_OUT' })
            router.push('/')
        },
        onError: (error) => {
            console.log(error.message)
        }
    })

    return (
        <>
            {mutation.isError && <Text>Something went wrong</Text>}
            <TouchableOpacity
                disabled={mutation.isPending}
                style={[
                    globalStyles.button,
                    {
                        backgroundColor: mutation.isPending
                            ? 'rgba(142,142,142,0.5)'
                            : 'rgb(108 194 74)'
                    }
                ]}
                onPress={() => {
                    mutation.mutate()
                }}
            >
                {mutation.isPending ? (
                    <ActivityIndicator />
                ) : (
                    <Text style={[globalStyles.buttonText, { color: 'white' }]}>
                        {' '}
                        Logout{' '}
                    </Text>
                )}
            </TouchableOpacity>
        </>
    )
}
