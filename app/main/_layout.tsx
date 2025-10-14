import { Tabs } from 'expo-router'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

export default function MainLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <FontAwesomeIcon
                            icon={faHome as IconProp}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="user"
                options={{
                    title: 'User',
                    tabBarIcon: ({ color }) => (
                        <FontAwesomeIcon
                            icon={faUser as IconProp}
                            color={color}
                        />
                    )
                }}
            />
        </Tabs>
    )
}
