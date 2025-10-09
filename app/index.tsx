import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import * as SecureStore from 'expo-secure-store'
import { router } from 'expo-router'

type LoginData = {
    username: string
    password: string
}

const authURL: string | undefined = process.env.EXPO_PUBLIC_AUTH_URL

async function loginUser({ username, password }: LoginData) {
    if (!authURL) {
        throw new Error('Missing auth URL')
    }
    const res = await fetch(authURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Invalid credentials')
    }

    return res.json()
}

export default function Index() {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>({
        defaultValues: { username: '', password: '' },
    })

    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: async (data) => {
            await SecureStore.setItemAsync('auth', JSON.stringify(data))
            router.push('/home')
        },
        onError: (error: any) => {
            console.log(error.message)
        },
    })

    const onSubmit = (data: LoginData) => {
        console.log(data)
        mutation.mutate(data)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            {/* username Field */}
            <Controller
                control={control}
                name="username"
                rules={{
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Minimum 6 characters' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={[
                                styles.input,
                                errors.username && styles.errorInput,
                            ]}
                            placeholder="username"
                            autoCapitalize="none"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        {errors.username && (
                            <Text style={styles.errorText}>
                                {errors.username.message}
                            </Text>
                        )}
                    </View>
                )}
            />

            {/* Password Field */}
            <Controller
                control={control}
                name="password"
                rules={{
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Invalid password' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={[
                                styles.input,
                                errors.password && styles.errorInput,
                            ]}
                            placeholder="Password"
                            secureTextEntry
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        {errors.password && (
                            <Text style={styles.errorText}>
                                {errors.password.message}
                            </Text>
                        )}
                    </View>
                )}
            />
            {mutation.isError && <Text>{mutation.error.messsage}</Text>}
            {/* Submit Button */}
            <Button
                title={isSubmitting ? 'Logging in...' : 'Login'}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    errorInput: {
        borderColor: '#ff4d4f',
    },
    errorText: {
        color: '#ff4d4f',
        marginTop: 4,
        fontSize: 13,
    },
})
