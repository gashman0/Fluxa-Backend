const openapiSpec = {
  openapi: "3.0.3",

  info: {
    title: "Fluxa API",
    version: "1.0.0",
    description: "API documentation for the Fluxa platform.",
  },

  servers: [
    {
      url: "https://api.fluxa.dev",
      description: "Production server",
    },
    {
      url: "http://localhost:8082",
      description: "Local development server",
    },
  ],

  paths: {},
};

export default openapiSpec;