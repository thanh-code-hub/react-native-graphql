import { Button } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { router } from 'expo-router'

export default function UserScreen() {
    return (
        <Button
            onPress={async () => {
                await SecureStore.deleteItemAsync('auth')
                router.push('/')
            }}
            title="Logout"
        />
    )
}
