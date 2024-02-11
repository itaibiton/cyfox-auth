# Cyfox Authentication System

## Overview

Cyfox Authentication System is a comprehensive authentication solution built with Next.js, Firebase, and NextAuth. It supports traditional email and password registration/login, multifactor authentication (MFA) with OTP (One-Time Password), and social login via GitHub.This system is designed to provide a secure and user-friendly authentication experience, leveraging Firebase for backend services and NextAuth for session management.

## Features

- Email and password authentication.
- MFA with OTP, supporting authenticator apps.
- Social login with GitHub and Facebook.
- Secure session management with NextAuth.
- User-friendly password reset flow.
- Customizable and responsive UI.

## Prerequisites

- Node.js (v14 or later recommended)
- Firebase project and credentials
- GitHub developer accounts for OAuth setup
- Environment variables configured for Firebase and social providers

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cyfox-auth-system.git
   ```
2. Navigate to the project directory:
   ```bash
   cd cyfox-auth-system
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your environment variables by renaming `.env.local.example` to `.env.local` and filling in your Firebase and social login credentials.

5. Start the development server:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` in your browser to see the application.

## Usage

- **Registration**: New users can register using their email and password or through GitHub and Facebook. MFA setup is encouraged for email and password registrations.
- **Login**: Users can log in using their chosen method during registration. Email and password users will be prompted for an OTP if MFA is enabled.
- **Password Reset**: Users registered with email and password can initiate a password reset from the settings page.

## Configuration

To configure social login providers or adjust Firebase settings, modify the `.env.local` file with your specific credentials. For detailed configuration options, refer to the Firebase and NextAuth documentation.

## Acknowledgments

- Next.js Team for the awesome framework.
- Firebase for providing a powerful backend service.
- NextAuth for simplifying Next.js authentication.
