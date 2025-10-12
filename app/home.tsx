import { Button } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { router } from 'expo-router'
import InfiniteList from '@/components/infiniteList'

export default function HomeScreen() {
    return (
        <>
            <InfiniteList />
            <Button
                onPress={async () => {
                    await SecureStore.deleteItemAsync('auth')
                    router.push('/')
                }}
                title="Logout"
            />
        </>
    )
}
