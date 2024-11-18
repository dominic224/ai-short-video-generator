/** @type { import("drizzle-kit").Config } */

export default {
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials: {
    url: "postgresql://ai-short-video-generator_owner:hVL5B0xPlZdO@ep-late-night-a5rfh9ux.us-east-2.aws.neon.tech/ai-short-video-generator?sslmode=require",
  },
};
