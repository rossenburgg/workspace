# SprinTelex

SprinTelex is an innovative messaging application designed to facilitate communication between users. It prioritizes user privacy, security, and ease of use while introducing innovative features such as "Reels" for sharing short video clips and user verification badges to enhance the user experience.

## Overview

SprinTelex leverages React Native Expo for the frontend, providing a seamless cross-platform user experience. The backend is powered by Node.js and Express, with MongoDB as the database for storing user information, messages, and video clips. Security is a top priority, with JWT for authentication and bcrypt for password hashing. The app's architecture is designed for scalability and robustness, ensuring a smooth and secure user experience.

## Features

- **User Authentication and Verification**: Users can register and verify their accounts using email or phone number.
- **Messaging**: Users can send text, images, videos, documents, and voice messages privately or in groups.
- **Reels**: Users can create, edit, and share short video clips with their followers.
- **User Profile**: Customizable user profiles with options for privacy settings and account management.
- **Security**: End-to-end encryption for messages and two-factor authentication for enhanced security.

## Getting started

### Requirements

- Node.js
- MongoDB
- React Native Expo

### Quickstart

1. Clone the project repository.
2. Install dependencies by running `npm install` in both the project root and the `backend` directory.
3. Set up your MongoDB database and update the `.env.local` file in the `backend/config` directory with your database URI.
4. Start the backend server by running `npm start` in the `backend` directory.
5. Start the React Native app by running `npm start` in the project root directory.

### License

Copyright (c) 2024.