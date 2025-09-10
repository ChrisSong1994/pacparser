import { defineConfig } from "vitest/config";

const TEST_INCLUDES = ["./tests/*.test.ts"];

export default defineConfig(() => {
  return {
    test: {
      testTimeout: 20000, //  20s for pingpang
      include: TEST_INCLUDES,
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  };
});
