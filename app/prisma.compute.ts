import { defineComputeConfig } from "@prisma/compute-sdk/config";

export default defineComputeConfig({
  app: {
    name: "my-app",
    framework: "nextjs",
    env: ".env",
  },
});
