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
      url: "http://localhost:3000",
    },
  ],

  tags: [
    { name: "Auth" },
    { name: "Events" },
    { name: "Categories" },
    { name: "Registrations" },
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
                    example: "user@example.com",
                  },
                  password: {
                    type: "string",
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
            schema: { type: "string" },
          },
          {
            name: "city",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "category",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "startDate",
            in: "query",
            schema: { type: "string", format: "date" },
          },
          {
            name: "endDate",
            in: "query",
            schema: { type: "string", format: "date" },
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1 },
          },
          {
            name: "sort",
            in: "query",
            schema: {
              type: "string",
              example: "date",
            },
          },
        ],
        responses: {
          200: {
            description: "Events returned successfully",
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
                  capacity: {
                    type: "integer",
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
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Event returned successfully",
          },
          404: {
            description: "Event not found",
          },
        },
      },

      put: {
        tags: ["Events"],
        summary: "Update event",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
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
                  capacity: {
                    type: "integer",
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
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Event deleted successfully",
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
                required: ["eventId"],
                properties: {
                  eventId: {
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
            description: "Duplicate or full event",
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
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Registration cancelled successfully",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Cannot cancel another user's registration",
          },
          404: {
            description: "Registration not found",
          },
        },
      },
    },

    "/api/messages/{eventId}": {
      get: {
        tags: ["Messages"],
        summary: "Get event announcement history",
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
          401: {
            description: "Authentication required",
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