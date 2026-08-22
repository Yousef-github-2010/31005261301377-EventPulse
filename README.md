# EventPulse

A complete Event Management Backend API built with **Node.js, Express, MongoDB, Socket.io, JWT Authentication, Jest, Supertest, and Swagger**.

EventPulse allows users to discover events, register for them, manage registrations, and receive real-time event announcements. Administrators can create and manage events and send announcements to attendees.

## Features

* User registration and login
* JWT-based authentication
* Role-based authorization
* Admin and attendee roles
* Event CRUD operations
* Event categories
* Search and filtering
* Pagination and sorting
* Event registration
* Duplicate registration protection
* Registration cancellation
* View personal registrations
* Real-time announcements using Socket.io
* Announcement history
* Centralized error handling
* Request validation
* API documentation with Swagger
* Automated testing with Jest and Supertest

## Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **Socket.io**
* **JWT**
* **bcrypt**
* **express-validator**
* **Jest**
* **Supertest**
* **Swagger UI**

## Project Structure

```text
EventPulse/
├── config/
│   └── db.js
├── controllers/
│   ├── announcementController.js
│   ├── authController.js
│   ├── categoryController.js
│   ├── eventController.js
│   ├── healthController.js
│   ├── messageController.js
│   └── registrationController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── validateRequest.js
├── models/
│   ├── Category.js
│   ├── Event.js
│   ├── Message.js
│   ├── Registration.js
│   └── User.js
├── routes/
│   ├── announcementRoutes.js
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   ├── eventRoutes.js
│   ├── healthRoutes.js
│   ├── messageRoutes.js
│   └── registrationRoutes.js
├── socket-client/
│   └── socket-client.js
├── tests/
│   ├── appError.test.js
│   ├── asyncHandler.test.js
│   ├── event.test.js
│   └── registration.test.js
├── app.js
├── swagger.js
├── package.json
└── .env.example
```

## Installation

Clone the repository:

```bash
git clone https://github.com/Yousef-github-2010/EventPulse.git
cd EventPulse
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Running the Project

Start the server:

```bash
npm start
```

Run the project with Nodemon:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

## Health Check

```http
GET /health
```

Example response:

```json
{
  "success": true,
  "message": "Server is running",
  "data": {
    "database": "Connected"
  }
}
```

## API Endpoints

### Authentication

| Method | Endpoint             | Access |
| ------ | -------------------- | ------ |
| POST   | `/api/auth/register` | Public |
| POST   | `/api/auth/login`    | Public |

### Events

| Method | Endpoint          | Access |
| ------ | ----------------- | ------ |
| GET    | `/api/events`     | Public |
| GET    | `/api/events/:id` | Public |
| POST   | `/api/events`     | Admin  |
| PATCH  | `/api/events/:id` | Admin  |
| DELETE | `/api/events/:id` | Admin  |

Events support:

* Search
* City filtering
* Category filtering
* Date filtering
* Pagination
* Sorting

Example:

```text
GET /api/events?city=Cairo&page=1&limit=10&sortBy=date&order=asc
```

### Categories

| Method | Endpoint          | Access |
| ------ | ----------------- | ------ |
| GET    | `/api/categories` | Public |

### Registrations

| Method | Endpoint                 | Access        |
| ------ | ------------------------ | ------------- |
| POST   | `/api/registrations`     | Authenticated |
| GET    | `/api/registrations/my`  | Authenticated |
| DELETE | `/api/registrations/:id` | Authenticated |

The registration system prevents users from registering for the same event more than once and checks event capacity.

### Announcements

| Method | Endpoint                      | Access |
| ------ | ----------------------------- | ------ |
| POST   | `/api/announcements`          | Admin  |
| GET    | `/api/announcements/:eventId` | Public |

Admins can send announcements to a specific event.

### Messages

| Method | Endpoint                 | Access        |
| ------ | ------------------------ | ------------- |
| GET    | `/api/messages/:eventId` | Authenticated |

## Authentication

EventPulse uses **JWT Bearer Authentication**.

After login, include the returned token in protected requests:

```http
Authorization: Bearer YOUR_TOKEN
```

Example:

```bash
curl http://localhost:3000/api/registrations/my \
-H "Authorization: Bearer YOUR_TOKEN"
```

## Role-Based Authorization

EventPulse has two roles:

### Admin

Admins can:

* Create events
* Update events
* Delete events
* Send event announcements

### Attendee

Attendees can:

* Browse events
* Register for events
* View their registrations
* Cancel their registrations
* Receive real-time announcements

## Real-Time Communication

EventPulse uses **Socket.io** for real-time event announcements.

The socket client is available at:

```text
socket-client/socket-client.js
```

Run it with:

```bash
node socket-client/socket-client.js
```

The client connects to the server and joins an event room.

When an admin sends an announcement, connected clients receive it immediately through the Socket.io `announcement` event.

Example event:

```text
announcement
```

## Swagger API Documentation

Interactive API documentation is available through Swagger UI:

```text
http://localhost:3000/api-docs
```

Swagger documents the available API endpoints, authentication requirements, request parameters, request bodies, and responses.

## Testing

The project uses **Jest** and **Supertest**.

Run all tests:

```bash
npm test
```

Run tests with open-handle detection:

```bash
npm test -- --detectOpenHandles
```

Current test status:

```text
Test Suites: 4 passed, 4 total
Tests:       9 passed, 9 total
```

## Error Handling

The API uses centralized error handling for common errors including:

* Validation errors
* Invalid MongoDB ObjectIds
* Duplicate database records
* Authentication errors
* Authorization errors
* Not found errors
* Server errors

Example:

```json
{
  "status": "fail",
  "message": "You are already registered for this event"
}
```

## Database

MongoDB Atlas is used as the database.

Main collections/models:

* Users
* Events
* Categories
* Registrations
* Messages

Events use MongoDB ObjectId references for categories and organizers, with Mongoose `populate()` used when retrieving event data.

## Environment Variables

Create `.env` locally and never commit it to GitHub.

Required variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

The repository includes `.env.example` as a template.

## API Example

### Create an Event

```http
POST /api/events
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

Request body:

```json
{
  "title": "Node.js Workshop",
  "description": "Learn Backend Development",
  "category": "CATEGORY_ID",
  "date": "2027-01-15T00:00:00.000Z",
  "city": "Cairo",
  "venue": "Test Venue",
  "capacity": 50
}
```

### Register for an Event

```http
POST /api/registrations
Authorization: Bearer ATTENDEE_TOKEN
Content-Type: application/json
```

Request body:

```json
{
  "event": "EVENT_ID"
}
```

## Project Status

The EventPulse backend is fully implemented and tested.

Current status:

* API: Complete
* Authentication: Complete
* Authorization: Complete
* Event Management: Complete
* Registration System: Complete
* Real-Time Communication: Complete
* Announcements: Complete
* Testing: Complete
* Swagger Documentation: Complete

## Author

**Yousef Ibrahim**

GitHub:

https://github.com/Yousef-github-2010
