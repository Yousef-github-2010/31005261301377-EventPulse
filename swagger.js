const swaggerUi = require("swagger-ui-express");

const swaggerDocument = {
  openapi: "3.0.0",

  info: {
    title: "EventPulse API",
    version: "1.0.0",
    description: "Event Management Backend API",
  },

  servers: [
    {
      url: process.env.API_BASE_URL || "http://localhost:3000",
    },
  ],

  tags: [
    { name: "Auth" },
    { name: "Events" },
    { name: "Categories" },
    { name: "Registrations" },
    { name: "Announcements" },
    { name: "Messages" },
    { name: "Health" },
  ],

  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Check server and database status",
        responses: {
          200: {
            description: "Server status",
          },
        },
      },
    },

    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new attendee",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: {
                    type: "string",
                    example: "Yousef",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "user@example.com",
                  },
                  password: {
                    type: "string",
                    minLength: 6,
                    example: "123456",
                  },
                },
              },
            },
          },
        },

        responses: {
          201: {
            description: "User registered successfully",
          },
          400: {
            description: "Email already exists",
          },
          422: {
            description: "Validation error",
          },
        },
      },
    },

    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "admin@eventpulse.com",
                  },
                  password: {
                    type: "string",
                    example: "Admin123",
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: "Login successful",
          },
          401: {
            description: "Invalid email or password",
          },
          422: {
            description: "Validation error",
          },
        },
      },
    },

    "/api/categories": {
      get: {
        tags: ["Categories"],
        summary: "Get all categories",

        responses: {
          200: {
            description: "Categories returned successfully",
          },
        },
      },
    },

    "/api/events": {
      get: {
        tags: ["Events"],
        summary: "Get events",

        parameters: [
          {
            name: "search",
            in: "query",
            schema: {
              type: "string",
            },
          },
          {
            name: "city",
            in: "query",
            schema: {
              type: "string",
            },
          },
          {
            name: "category",
            in: "query",
            schema: {
              type: "string",
            },
          },
          {
            name: "startDate",
            in: "query",
            schema: {
              type: "string",
              format: "date",
            },
          },
          {
            name: "endDate",
            in: "query",
            schema: {
              type: "string",
              format: "date",
            },
          },
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
          {
            name: "sortBy",
            in: "query",
            schema: {
              type: "string",
              enum: [
                "date",
                "title",
                "city",
                "capacity",
                "createdAt",
                "registrations",
              ],
              default: "date",
            },
          },
          {
            name: "order",
            in: "query",
            schema: {
              type: "string",
              enum: ["asc", "desc"],
              default: "asc",
            },
          },
        ],

        responses: {
          200: {
            description: "Events returned successfully",
          },
          400: {
            description: "Invalid query parameter",
          },
        },
      },

      post: {
        tags: ["Events"],
        summary: "Create event",
        security: [{ bearerAuth: [] }],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "title",
                  "description",
                  "date",
                  "city",
                  "venue",
                  "capacity",
                  "category",
                ],

                properties: {
                  title: {
                    type: "string",
                    example: "Node.js Workshop",
                  },
                  description: {
                    type: "string",
                    example: "Learn Backend Development",
                  },
                  date: {
                    type: "string",
                    format: "date",
                    example: "2026-09-01",
                  },
                  city: {
                    type: "string",
                    example: "Cairo",
                  },
                  venue: {
                    type: "string",
                    example: "Bibliotheca Alexandria",
                  },
                  capacity: {
                    type: "integer",
                    minimum: 1,
                    example: 100,
                  },
                  category: {
                    type: "string",
                    example: "66a123456789",
                  },
                },
              },
            },
          },
        },

        responses: {
          201: {
            description: "Event created successfully",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Admin access required",
          },
          422: {
            description: "Validation error",
          },
        },
      },
    },

    "/api/events/{id}": {
      get: {
        tags: ["Events"],
        summary: "Get event by ID",

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          200: {
            description: "Event returned successfully",
          },
          400: {
            description: "Invalid event ID",
          },
          404: {
            description: "Event not found",
          },
        },
      },

      patch: {
        tags: ["Events"],
        summary: "Update event",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  title: {
                    type: "string",
                  },
                  description: {
                    type: "string",
                  },
                  date: {
                    type: "string",
                    format: "date",
                  },
                  city: {
                    type: "string",
                  },
                  venue: {
                    type: "string",
                  },
                  capacity: {
                    type: "integer",
                    minimum: 1,
                  },
                  category: {
                    type: "string",
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: "Event updated successfully",
          },
          400: {
            description: "Invalid event ID",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Admin access required",
          },
          404: {
            description: "Event not found",
          },
          422: {
            description: "Validation error",
          },
        },
      },

      delete: {
        tags: ["Events"],
        summary: "Delete event",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          200: {
            description: "Event deleted successfully",
          },
          400: {
            description: "Invalid event ID",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Admin access required",
          },
          404: {
            description: "Event not found",
          },
        },
      },
    },

    "/api/registrations": {
      post: {
        tags: ["Registrations"],
        summary: "Register for an event",
        security: [{ bearerAuth: [] }],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["event"],

                properties: {
                  event: {
                    type: "string",
                    example: "66a123456789",
                  },
                },
              },
            },
          },
        },

        responses: {
          201: {
            description: "Registration successful",
          },
          400: {
            description: "Duplicate registration or event is full",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Attendee access required",
          },
          404: {
            description: "Event not found",
          },
          422: {
            description: "Validation error",
          },
        },
      },
    },

    "/api/registrations/my": {
      get: {
        tags: ["Registrations"],
        summary: "Get my registrations",
        security: [{ bearerAuth: [] }],

        responses: {
          200: {
            description: "Registrations returned successfully",
          },
          401: {
            description: "Authentication required",
          },
        },
      },
    },

    "/api/registrations/{id}": {
      delete: {
        tags: ["Registrations"],
        summary: "Cancel registration",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          200: {
            description: "Registration cancelled successfully",
          },
          400: {
            description: "Invalid registration ID",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description:
              "Cannot cancel another user's registration",
          },
          404: {
            description: "Registration not found",
          },
        },
      },
    },

    "/api/announcements": {
      post: {
        tags: ["Announcements"],
        summary: "Create an event announcement",
        security: [{ bearerAuth: [] }],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["eventId", "text"],

                properties: {
                  eventId: {
                    type: "string",
                    example: "66a123456789",
                  },
                  text: {
                    type: "string",
                    example:
                      "The workshop will start at 10 AM.",
                  },
                },
              },
            },
          },
        },

        responses: {
          201: {
            description: "Announcement sent successfully",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Admin access required",
          },
          404: {
            description: "Event not found",
          },
          422: {
            description: "Validation error",
          },
        },
      },
    },

    "/api/announcements/{eventId}": {
      get: {
        tags: ["Announcements"],
        summary: "Get event announcement history",

        parameters: [
          {
            name: "eventId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          200: {
            description: "Announcements returned successfully",
          },
          400: {
            description: "Invalid event ID",
          },
          404: {
            description: "Event not found",
          },
        },
      },
    },

    "/api/messages/{eventId}": {
      get: {
        tags: ["Messages"],
        summary: "Get event messages",

        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "eventId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          200: {
            description: "Messages returned successfully",
          },
          400: {
            description: "Invalid event ID",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description:
              "User must be registered for the event",
          },
          404: {
            description: "Event not found",
          },
        },
      },
    },
  },

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

module.exports = {
  swaggerUi,
  swaggerDocument,
};