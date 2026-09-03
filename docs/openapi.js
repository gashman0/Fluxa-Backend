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
                example: "john@example.com",
              },
            },
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
    },
  },

  paths: {
    // ========================================
    // Authentication
    // ========================================

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
        description:
          "Clears the access and refresh token HTTP-only cookies.",

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
  },
};

export default openapiSpec;