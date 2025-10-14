import { StatusBar } from 'expo-status-bar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppContextProvider, useAppContext } from '@/context-provider/provider'
import { Stack } from 'expo-router'

const queryClient = new QueryClient()

export default function RootLayout() {
    return (
        <AppContextProvider>
            <QueryClientProvider client={queryClient}>
                <RootNavigation />
                <StatusBar style="auto" />
            </QueryClientProvider>
        </AppContextProvider>
    )
}

function RootNavigation() {
    const { isSignedIn } = useAppContext()

    return (
        <Stack>
            <Stack.Protected guard={isSignedIn}>
                <Stack.Screen name="main" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    )
}
