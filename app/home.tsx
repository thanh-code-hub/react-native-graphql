import { Button, Text, View } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { router } from 'expo-router'

export default function HomeScreen() {
    return (
        <View>
            <Text>Home</Text>
            <Button
                onPress={async () => {
                    await SecureStore.deleteItemAsync('auth')
                    router.push('/')
                }}
                title="Logout"
            />
        </View>
    )
}
