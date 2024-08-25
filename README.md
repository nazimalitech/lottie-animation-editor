# Real-Time Animation Editor with Collaboration

## Overview

This project is a real-time animation editor that allows users to create and edit animations collaboratively. It features user authentication, real-time messaging, and animation editing using LottieFiles animations. The application leverages Apollo GraphQL, WebSocket for real-time updates, and a modern frontend built with React and Redux.

## Features

- Animation editing using LottieFiles
- Real-time collaboration on animations
- Secure JWT authentication
- User Registration and Login
- Real-time chat feature
- Socket.IO for real-time updates

## Live Demo

Check out the live demo of the project [here](https://animation-editor-vuxn.onrender.com).

## Technologies Used

### Frontend
- React
- Redux
- TypeScript
- Socket.IO Client
- Apollo Client
- Axios

### Backend
- Node.js
- Express
- Apollo Server
- Socket.IO
- JWT
- PostgreSQL

### Other Tools
- LottieFiles API

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- LottieFiles API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nazimalitech/lottie-animation-editor.git
   cd lottie-animation-editor

2. **Backend Setup:**
- Navigate to the server directory:
   ```bash
   cd server
- Install server dependencies:
   ```bash
   npm install
- Start the server:
   ```bash
   node index.js

3. **Frontend Setup:**
- Navigate to the client directory:
   ```bash
   cd ../client
- Install client dependencies:
   ```bash
   npm install
- Start the frontend:
   ```bash
   npm start

4. **Run the Application:**
- Open your browser and go to http://localhost:3000

## Usage

- Register a new user or login with an existing account.
- Use the animation editor to create and edit animations in real-time.
- Join a room to start collaborating on animations.
- Use the chat feature to communicate with other collaborators in the room.

## API Endpoints

### Authentication
- **Register**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`

### GraphQL
- **Endpoint**: `http://localhost:4000/graphql`

## Real-Time Collaboration

- **Socket.IO Events**:
  - **`join`**: Join a room
  - **`leave`**: Leave a room
  - **`update`**: Send updates to a room
  - **`updateAnimationProperties`**: Update animation properties
  - **`updateLayerManagement`**: Manage animation layers
