const openapiSpec = {
  openapi: "3.0.3",

  info: {
    title: "Fluxa API",
    version: "1.0.0",
    description: "API documentation for the Fluxa platform.",
  },

  servers: [
    {
      url: "https://api.fluxa.bond",
      description: "Production",
    },
    {
      url: "http://localhost:8082",
      description: "Local development",
    },
  ],

  tags: [
    {
      name: "Authentication",
      description: "Authentication and session management",
    },
    {
      name: "User",
      description: "User account information",
    },
    {
      name: "Jobs",
      description: "Job discovery and listings",
    },
  ],

  components: {
    securitySchemes: {
      accessToken: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
        description: "HTTP-only access token cookie",
      },

      refreshToken: {
        type: "apiKey",
        in: "cookie",
        name: "refreshToken",
        description: "HTTP-only refresh token cookie",
      },
    },

    schemas: {
      SignupRequest: {
        type: "object",
        properties: {
          name: {
            type: "string",
            example: "John Doe",
          },
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "password123",
          },
        },
      },

      LoginRequest: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "password123",
          },
        },
      },

      MessageResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
          },
        },
      },

      LoginResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Login Successful",
          },

          user: {
            type: "object",
            properties: {
              id: {
                type: "string",
                example: "64f123456789abcdef123456",
              },
              name: {
                type: "string",
                example: "John Doe",
              },
              email: {
                type: "string",
                format: "email",
                example: "john@example.com",
              },
            },
          },
        },
      },

      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "64f123456789abcdef123456",
          },
          name: {
            type: "string",
            example: "John Doe",
          },
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-09-03T10:30:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-09-03T10:30:00.000Z",
          },
        },
      },

      Job: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "64f123456789abcdef123456",
          },
          title: {
            type: "string",
            example: "Frontend Engineer",
          },
          company: {
            type: "string",
            example: "Acme Inc.",
          },
          description: {
            type: "string",
            example: "We are looking for a talented frontend engineer.",
          },
          location: {
            type: "string",
            example: "Remote",
          },
          url: {
            type: "string",
            format: "uri",
            example: "https://example.com/jobs/frontend-engineer",
          },
          source: {
            type: "string",
            example: "greenhouse",
          },
          externalId: {
            type: "string",
            example: "123456",
          },
          publishedAt: {
            type: "string",
            format: "date-time",
            nullable: true,
            example: "2026-09-03T10:30:00.000Z",
          },
          metadata: {
            description: "Additional metadata associated with the job.",
            nullable: true,
            example: {
              location: {
                name: "Remote",
              },
              company_name: "Acme Inc.",
            },
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-09-03T10:30:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-09-03T10:30:00.000Z",
          },
        },
      },

      ErrorResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
          },
        },
      },

      JobsResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          count: {
            type: "integer",
            example: 829,
          },
          jobs: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Job",
            },
          },
        },
      },
    },
  },

  paths: {
    // Authentication
    "/signup": {
      post: {
        tags: ["Authentication"],
        summary: "Create a new user account",
        description: "Creates a new Fluxa user account.",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SignupRequest",
              },
            },
          },
        },

        responses: {
          201: {
            description: "User created successfully",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },

                example: {
                  message: "User signed up successfully!",
                },
              },
            },
          },

          400: {
            description: "User already exists",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },

                example: {
                  Message: "User already exists",
                },
              },
            },
          },

          500: {
            description: "Internal server error",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },

                example: {
                  message: "Internal server error",
                },
              },
            },
          },
        },
      },
    },

    "/login": {
      post: {
        tags: ["Authentication"],
        summary: "Log in a user",
        description:
          "Authenticates a user and sets HTTP-only access and refresh token cookies.",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest",
              },
            },
          },
        },

        responses: {
          200: {
            description: "Login successful",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginResponse",
                },

                example: {
                  message: "Login Successful",
                  user: {
                    id: "64f123456789abcdef123456",
                    name: "John Doe",
                    email: "john@example.com",
                  },
                },
              },
            },
          },

          400: {
            description: "Invalid credentials",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },

                example: {
                  message: "Invalid credentials",
                },
              },
            },
          },

          500: {
            description: "Internal server error",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },

                example: {
                  message: "Internal server error",
                },
              },
            },
          },
        },
      },
    },

    "/refresh": {
      post: {
        tags: ["Authentication"],
        summary: "Refresh the access token",
        description:
          "Uses the refresh token stored in the HTTP-only cookie to issue a new access token.",

        security: [
          {
            refreshToken: [],
          },
        ],

        responses: {
          200: {
            description: "Access token refreshed",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },

                example: {
                  message: "Token refreshed",
                },
              },
            },
          },

          401: {
            description: "Refresh token is missing or invalid",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },

                examples: {
                  missingToken: {
                    summary: "No refresh token",
                    value: {
                      message: "No refresh token",
                    },
                  },

                  invalidToken: {
                    summary: "Invalid refresh token",
                    value: {
                      message: "Invalid refresh token",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/logout": {
      post: {
        tags: ["Authentication"],
        summary: "Log out the current user",
        description: "Clears the access and refresh token HTTP-only cookies.",

        responses: {
          200: {
            description: "User logged out successfully",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },

                example: {
                  message: "Logged out",
                },
              },
            },
          },
        },
      },
    },

    // User
    "/me": {
      get: {
        tags: ["User"],
        summary: "Get the current user",
        description: "Returns the authenticated user's account information.",

        security: [
          {
            accessToken: [],
          },
        ],

        responses: {
          200: {
            description: "Authenticated user returned successfully",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },

                example: {
                  _id: "64f123456789abcdef123456",
                  name: "John Doe",
                  email: "john@example.com",
                  createdAt: "2026-09-03T10:30:00.000Z",
                  updatedAt: "2026-09-03T10:30:00.000Z",
                },
              },
            },
          },

          401: {
            description: "User is not authorized",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },

                examples: {
                  noToken: {
                    summary: "No access token",
                    value: {
                      message: "Not authorized",
                    },
                  },

                  invalidToken: {
                    summary: "Invalid or expired access token",
                    value: {
                      message: "Token expired",
                    },
                  },
                },
              },
            },
          },

          500: {
            description: "Internal server error",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },

                example: {
                  message: "Internal server error",
                },
              },
            },
          },
        },
      },
    },

    // Jobs
    "/jobs": {
      get: {
        tags: ["Jobs"],

        summary: "Get available jobs",

        description:
          "Returns all available jobs sorted by publication date, with the newest jobs first.",

        security: [
          {
            accessToken: [],
          },
        ],

        responses: {
          200: {
            description: "Jobs retrieved successfully",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/JobsResponse",
                },

                example: {
                  success: true,
                  count: 2,
                  jobs: [
                    {
                      _id: "64f123456789abcdef123456",
                      title: "Frontend Engineer",
                      company: "Acme Inc.",
                      description:
                        "We are looking for a talented frontend engineer.",
                      location: "Remote",
                      url: "https://example.com/jobs/frontend-engineer",
                      source: "greenhouse",
                      externalId: "123456",
                      publishedAt: "2026-09-03T10:30:00.000Z",
                      metadata: {
                        location: {
                          name: "Remote",
                        },
                      },
                      createdAt: "2026-09-03T10:35:00.000Z",
                      updatedAt: "2026-09-03T10:35:00.000Z",
                    },

                    {
                      _id: "64f123456789abcdef123457",
                      title: "Backend Engineer",
                      company: "Tech Corp",
                      description: "",
                      location: "New York, NY",
                      url: "https://example.com/jobs/backend-engineer",
                      source: "greenhouse",
                      externalId: "123457",
                      publishedAt: "2026-09-02T15:20:00.000Z",
                      metadata: null,
                      createdAt: "2026-09-02T15:25:00.000Z",
                      updatedAt: "2026-09-02T15:25:00.000Z",
                    },
                  ],
                },
              },
            },
          },

          401: {
            description: "User is not authorized",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },

                example: {
                  message: "Not authorized",
                },
              },
            },
          },

          500: {
            description: "Internal server error while fetching jobs",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },

                example: {
                  message: "Internal server error fetching jobs",
                },
              },
            },
          },
        },
      },
    },
  },
};

export default openapiSpec;
