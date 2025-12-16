# StayEase - Hotel Booking System

A MERN (MongoDB, Express.js, React, Node.js) based Hotel Booking website that provides functionality for hotel management, room booking, and payment processing. This project includes features like date concurrency, two-factor authentication (2FA), rate limiting with Redis, role-based access control (RBAC), and payment integration using Stripe.

## Features

- **Hotel Management**: Admins can add, update, or delete hotels and manage the list of rooms.
- **Room Booking**: Users can browse hotels, check room availability, and book rooms based on their preferences.
- **Date Concurrency**: Prevents double booking of rooms for the same dates.
- **Payment Gateway Integration**: Stripe is used to process payments for bookings.
- **Two-Factor Authentication (2FA)**: Users can enable 2FA for added security during login.
- **Role-Based Access Control (RBAC)**: Different user roles (Admin, User) with restricted access to certain features.
- **Rate Limiting**: Redis is used to limit the number of requests from users and to store OTPs.
- **Secure Authentication**: JWT-based authentication and bcrypt for password hashing.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **File Uploads**: Multer, Cloudinary (for images)
- **Redis**: Used for rate limiting and OTP storage
- **Payment Gateway**: Stripe
- **Logging**: Winston
- **Email Service**: Nodemailer
- **Validation**: Joi
- **Security**: Helmet, mongo-sanitize
- **Other**: dotenv, cookie-parser, cors


### Prerequisites

- Node.js (>= 16.0.0)
- MongoDB (cloud or local instance)
- Redis (for rate limiting and OTP storage)
- Stripe account (for payment processing)
- Cloudinary account (for image uploads)

### Environment Variables
- PORT=
- FRONTEND_URL=
- MONGO_URL=
- NODE_ENV="development"
- UPSTASH_REDIS_REST_URL=
- UPSTASH_REDIS_REST_TOKEN=
- SMTP_USER=
- SMTP_PASS=
- SENDER_EMAIL=
- ACCESS_SECRET=
- REFRESH_SECRET=
- CLOUDINARY_NAME=
- CLOUDINARY_API_KEY=
- CLOUDINARY_API_SECRET=

License

This project is licensed under the MIT License - see the LICENSE
 file for details.
