# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Set up your environment by following these [instructions](https://docs.expo.dev/get-started/set-up-your-environment/) from Expo.
2. Make and `.env` file
    ```bash
    cp .env.example .env
    ```
    and change the file. Example:
   ```
    #IAM service
    EXPO_PUBLIC_AUTH_URL=https://your.graphql.service
    # GraphQL service
    EXPO_PUBLIC_GRAPHQL_URL=https/your.iam.service
   ```
3. Install dependencies
   ```bash
   npm install
   ```

4. Start the app
   ```bash
    npm run start
   ```
and select from the menu

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

For native builds
```bash
  npm run ios
  npm run android
```

## Testing
```bash
   npm run test
```
Some warnings might show up while testing because of the setTimeout I use to slow down the fetchings, so you can see the spinner clearer.