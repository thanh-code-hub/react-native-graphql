import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider
} from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { AppContextProvider, useAppContext } from '@/context-provider/provider'
import { Stack } from 'expo-router'

const queryClient = new QueryClient()

export default function RootLayout() {
    const colorScheme = useColorScheme()

    return (
        <AppContextProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider
                    value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
                >
                    <RootNavigation />
                    <StatusBar style="auto" />
                </ThemeProvider>
            </QueryClientProvider>
        </AppContextProvider>
    )
}

function RootNavigation() {
    const { isSignedIn } = useAppContext()

    return (
        <Stack>
            <Stack.Protected guard={isSignedIn}>
                <Stack.Screen name="home" />
            </Stack.Protected>
            <Stack.Screen name="index" />
        </Stack>
    )
}
