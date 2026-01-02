# Cleaning Organizer
This app is meant for people who live in collectives, where there is a cleaning inspection.

The goal of the app is to be able to sign up for a collective, create tasks with a rotation every week, be able to mark your task as completed for the week + be able to see whether other people have finished their task.

## How to use
### Prerequisites
NodeJS - https://nodejs.org/en/download

A Firebase project with Auth and Firestore - https://firebase.google.com/

A mobile emulator (I use a Pixel 8 emulator installed through Android Studio). You can also run this on your own phone, through the Expo Go app. But beware: With the package "expo-dev-client" installed, the project might not work in Expo Go (at least mine didn't). There is a workaround if you still want to use your physical device. After you have run the `npm install` command, run this command to uninstall expo-dev-client: `npm uninstall expo-dev-client`.

### How to use
Download the repository (as a zip file or clone it with git)

Create a Firebase project with Auth and Firestore, and a Web application (It's easier to set up, and seems to work well for now)

Warning: You may need to tweak the Firestore rules a bit. If you are not sure how, here are my current rules: 
```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
  	match /users/{uid} {
    	allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid;
    }
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

When the Firebase project is set up, create a file called ".env" in the root of the project. See /utils/FirebaseConfig.ts for how to name the variables.

When you have NodeJS installed, run this command in the root of the folder: `npm install` -- This will install the dependencies from the package.json file in the project

Now you can run the app! You can do it with either of these commands:

1. `npx expo run:android` -- Builds and runs the application. Press "a" to open it on your emulator.

2. `npx expo start` -- Starts the local development server (without building).

3. `npx expo start --clear` -- Starts the local development server and clears bundler cache, useful if you run into unexcpected bugs caused by remnants.

4. `npx expo start --tunnel` -- If for some reason your network has limits (typically at universities) this makes you able to run it trough Expo Go.


