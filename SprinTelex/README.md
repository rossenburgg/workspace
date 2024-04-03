# SprinTelex

SprinTelex is a social media messaging app that focuses on real-time communication and a seamless user experience, inspired by the design and functionality of Telegram.

## Project Structure

- `components`: Contains reusable UI components.
- `screens`: Holds the different screens of the app, representing distinct views.
- `utilities`: Includes utility functions and helpers for various features.
- `navigation`: Organizes the navigation setup for moving between screens.

## Getting Started

This project is bootstrapped with Expo CLI. To run the app, ensure you have Expo CLI installed and execute `expo start`.

## Backend Dependencies

- `express`: Web application framework for Node.js, used for building the API and handling server-side logic.
- `mongoose`: Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and is used to translate between objects in code and their representation in MongoDB.
- `bcryptjs`: Library for hashing and salting passwords before storing them in the database, enhancing security.
- `jsonwebtoken`: Implements JSON Web Tokens (JWT) to securely transmit information between parties as a JSON object. This is used for secure user authentication.
- `nodemailer`: Module for email sending. Used for sending account verification and password reset emails.
- `socket.io`: Enables real-time, bidirectional and event-based communication between web clients and the server. Used for implementing real-time messaging features.