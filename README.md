# EventPulse

A complete Event Management Backend API built with Node.js, Express, MongoDB, Socket.io, JWT Authentication, Jest, Supertest, and Swagger.

EventPulse allows users to discover events, register for them, manage registrations, and receive real-time event announcements. Administrators can create and manage events and send announcements to attendees.

## Features

- User registration and login
- JWT-based authentication
- Role-based authorization
- Admin and attendee roles
- Event CRUD operations
- Event categories
- Search and filtering
- Pagination and sorting
- Event registration
- Duplicate registration protection
- Registration cancellation
- View personal registrations
- Real-time announcements using Socket.io
- Announcement history
- Centralized error handling
- Request validation
- API documentation with Swagger
- Automated testing with Jest and Supertest

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io
- JWT
- bcrypt
- express-validator
- Jest
- Supertest
- Swagger UI

## Project Structure

    31005261301377-EventPulse/
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

## Installation

Clone the repository:

    git clone https://github.com/Yousef-github-2010/31005261301377-EventPulse.git
    cd 31005261301377-EventPulse

Install dependencies:

    npm install

Create a `.env` file in the project root:

    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    NODE_ENV=development

## Running the Project

Start the server:

    npm start

Run the project with Nodemon:

    npm run dev

The API will be available at:

    http://localhost:3000

## Health Check

    GET /health

Example response:

    {
      "success": true,
      "message": "Server is running",
      "data": {
        "database": "Connected"
      }
    }

## API Endpoints

### Authentication

Method  | Endpoint  | Access
--- | --- | ---
POST  | `/api/auth/register`  | Public
POST  | `/api/auth/login`  | Public

### Events

Method  | Endpoint  | Access
--- | --- | ---
GET  | `/api/events`  | Public
GET  | `/api/events/:id`  | Public
POST  | `/api/events`  | Admin
PATCH  | `/api/events/:id`  | Admin
DELETE  | `/api/events/:id`  | Admin

Events support:

- Search
- City filtering
- Category filtering
- Date filtering
- Pagination
- Sorting
- Sorting by number of registrations

Example:

    GET /api/events?city=Cairo&page=1&limit=10&sortBy=date&order=asc

Example with search:

    GET /api/events?search=workshop

Example with combined filters:

    GET /api/events?city=Cairo&category=CATEGORY_ID&startDate=2026-01-01&endDate=2026-12-31&page=1&limit=10

### Categories

Method  | Endpoint  | Access
--- | --- | ---
GET  | `/api/categories`  | Public

### Registrations

Method  | Endpoint  | Access
--- | --- | ---
POST  | `/api/registrations`  | Authenticated
GET  | `/api/registrations/my`  | Authenticated
DELETE  | `/api/registrations/:id`  | Authenticated

The registration system prevents users from registering for the same event more than once and checks event capacity.

### Announcements

Method  | Endpoint  | Access
--- | --- | ---
POST  | `/api/announcements`  | Admin
GET  | `/api/announcements/:eventId`  | Public

Admins can send announcements to a specific event.

### Messages

Method  | Endpoint  | Access
--- | --- | ---
GET  | `/api/messages/:eventId`  | Authenticated

Registered attendees can view messages for events they are registered for.

## Authentication

EventPulse uses JWT Bearer Authentication.

After login, include the returned token in protected requests:

    Authorization: Bearer YOUR_TOKEN

Example:

    curl http://localhost:3000/api/registrations/my \
      -H "Authorization: Bearer YOUR_TOKEN"

## Role-Based Authorization

EventPulse has two roles:

### Admin

Admins can:

- Create events
- Update events
- Delete events
- Send event announcements

### Attendee

Attendees can:

- Browse events
- Register for events
- View their registrations
- Cancel their registrations
- Receive real-time announcements

## Real-Time Communication

EventPulse uses Socket.io for real-time event announcements.

The socket client is available at:

    socket-client/socket-client.js

Run it with:

    node socket-client/socket-client.js

The client connects to the server and joins an event room.

When an admin sends an announcement, connected clients receive it immediately through the Socket.io `announcement` event.

Example event:

    announcement

Each event has a dedicated Socket.io room:

    event:EVENT_ID

Only registered attendees of the event can join its room.

## Swagger API Documentation

Interactive API documentation is available through Swagger UI.

### Local Swagger

    http://localhost:3000/api-docs/

### Live Swagger

    https://event-pulse-sand.vercel.app/api-docs/

Swagger documents the available API endpoints, authentication requirements, request parameters, request bodies, and responses.

## Deployment

The EventPulse API is deployed on Vercel and connected to MongoDB Atlas.

### Live API

    https://event-pulse-sand.vercel.app

### Health Check

    https://event-pulse-sand.vercel.app/health

### Swagger Documentation

    https://event-pulse-sand.vercel.app/api-docs/

### GitHub Repository

    https://github.com/Yousef-github-2010/31005261301377-EventPulse

The deployed API uses environment variables configured on Vercel.

No database credentials or JWT secrets are committed to the repository.

## Testing

The project uses Jest and Supertest.

Run all tests:

    npm test

Run tests with open-handle detection:

    npm test -- --detectOpenHandles

Current test status:

    Test Suites: 4 passed, 4 total
    Tests: 12 passed, 12 total

The test suite covers:

- AppError unit tests
- asyncHandler unit tests
- Events API integration tests
- Registration API integration tests
- Event creation
- Event listing
- Event filtering
- Registration
- Duplicate registration prevention
- Personal registrations
- Registration cancellation

## Error Handling

The API uses centralized error handling for common errors including:

- Validation errors
- Invalid MongoDB ObjectIds
- Duplicate database records
- Authentication errors
- Authorization errors
- Not found errors
- Server errors

Example:

    {
      "status": "fail",
      "message": "You are already registered for this event"
    }

## Input Validation

POST and PATCH routes use `express-validator`.

Invalid requests return a `422` response containing a list of validation errors.

Example:

    {
      "success": false,
      "errors": [
        {
          "type": "field",
          "value": "",
          "msg": "Title is required",
          "path": "title",
          "location": "body"
        }
      ]
    }

## Database

MongoDB Atlas is used as the database.

Main collections/models:

- Users
- Events
- Categories
- Registrations
- Messages

Events use MongoDB ObjectId references for categories and organizers, with Mongoose `populate()` used when retrieving event data.

## Environment Variables

Create `.env` locally and never commit it to GitHub.

Required variables:

    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    NODE_ENV=development

The repository includes `.env.example` as a template.

## Seed Data

The project includes a database seed script.

Run:

    npm run seed

The seed script creates sample:

- Categories
- Events
- Admin user

The seeded admin account can be used to test protected admin endpoints.

## API Example

### Create an Event

    POST /api/events
    Authorization: Bearer ADMIN_TOKEN
    Content-Type: application/json

Request body:

    {
      "title": "Node.js Workshop",
      "description": "Learn Backend Development",
      "category": "CATEGORY_ID",
      "date": "2027-01-15T00:00:00.000Z",
      "city": "Cairo",
      "venue": "Test Venue",
      "capacity": 50
    }

### Register for an Event

    POST /api/registrations
    Authorization: Bearer ATTENDEE_TOKEN
    Content-Type: application/json

Request body:

    {
      "event": "EVENT_ID"
    }

### Search Events

    GET /api/events?search=Node

### Filter Events by City

    GET /api/events?city=Cairo

### Filter Events by Category

    GET /api/events?category=CATEGORY_ID

### Filter Events by Date Range

    GET /api/events?startDate=2026-01-01&endDate=2026-12-31

### Sort Events

    GET /api/events?sortBy=date&order=asc

### Sort by Registrations

    GET /api/events?sortBy=registrations&order=desc

### Pagination

    GET /api/events?page=1&limit=10

### Combined Query

    GET /api/events?search=workshop&city=Cairo&page=1&limit=10&sortBy=date&order=asc

## Project Status

The EventPulse backend is fully implemented and tested.

Current status:

- API: Complete
- Authentication: Complete
- Authorization: Complete
- Event Management: Complete
- Event Filtering: Complete
- Pagination and Sorting: Complete
- Event Registration: Complete
- Capacity Management: Complete
- Duplicate Registration Prevention: Complete
- Real-Time Communication: Complete
- Socket.io Event Rooms: Complete
- Announcements: Complete
- Announcement History: Complete
- Input Validation: Complete
- Central Error Handling: Complete
- Testing: Complete
- Swagger Documentation: Complete
- Vercel Deployment: Complete
- MongoDB Atlas: Connected

## Git Workflow

The project uses Git and GitHub for version control.

The repository includes:

- Conventional Commits
- `v1.0.0` release tag
- Final submission branch
- Open Pull Request

Pull Request:

    final EventPulse submission

## Submission Links

### GitHub Repository

    https://github.com/Yousef-github-2010/31005261301377-EventPulse

### Deployed API

    https://event-pulse-sand.vercel.app

### Swagger Documentation

    https://event-pulse-sand.vercel.app/api-docs/

### Health Endpoint

    https://event-pulse-sand.vercel.app/health

## Author

Yousef Ibrahim

GitHub:

    https://github.com/Yousef-github-2010