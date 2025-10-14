import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import * as SecureStore from 'expo-secure-store'
import { useAppContextDispatch } from '@/context-provider/provider'
import { router } from 'expo-router'
import { login } from '@/apis/rest'
import { LoginData } from '@/types/types'
import globalStyles from '@/styles/styles'

export default function LoginScreen() {
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginData>({
        defaultValues: { username: '', password: '' }
    })

    const dispatch = useAppContextDispatch()

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: async (data) => {
            await SecureStore.setItemAsync('auth', JSON.stringify(data))
            dispatch({ type: 'SIGN_IN' })
            router.push('/main/home')
        },
        onError: (error) => {
            console.error('Mutation error', error.message)
        }
    })

    const onSubmit = (data: LoginData) => {
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
                    minLength: { value: 3, message: 'Minimum 6 characters' }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={[
                                styles.input,
                                errors.username && styles.errorInput
                            ]}
                            placeholder="Username"
                            placeholderTextColor="#aaa"
                            autoCapitalize="none"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        {errors.username && (
                            <Text style={globalStyles.errorText}>
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
                    minLength: { value: 6, message: 'Invalid password' }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={[
                                styles.input,
                                errors.password && styles.errorInput
                            ]}
                            placeholder="Password"
                            placeholderTextColor="#aaa"
                            secureTextEntry
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        {errors.password && (
                            <Text style={globalStyles.errorText}>
                                {errors.password.message}
                            </Text>
                        )}
                    </View>
                )}
            />
            <Text style={globalStyles.errorText}>
                {mutation.isError && mutation.error.message}
            </Text>
            {/* Submit Button */}
            <View>
                <TouchableOpacity
                    disabled={mutation.isPending}
                    onPress={handleSubmit(onSubmit)}
                    role={'button'}
                    testID={'login-button'}
                    style={[
                        globalStyles.button,
                        {
                            backgroundColor: mutation.isPending
                                ? 'rgba(142,142,142,0.5)'
                                : 'rgb(108 194 74)'
                        }
                    ]}
                >
                    {mutation.isPending ? (
                        <ActivityIndicator accessibilityHint="loading-spinner" />
                    ) : (
                        <Text
                            style={[
                                globalStyles.buttonText,
                                { color: 'white' }
                            ]}
                        >
                            Login
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 32
    },
    inputGroup: {
        marginBottom: 16
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#000'
    },
    errorInput: {
        borderColor: '#ff4d4f'
    }
})
