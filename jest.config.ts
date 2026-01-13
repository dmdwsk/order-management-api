import type { Config } from "jest";

const config: Config = {
    testEnvironment: "node",

    testMatch: ["<rootDir>/src/**/*.int.test.ts", "<rootDir>/src/**/*.test.ts"],

    transform: {
        "^.+\\.ts$": [
            "ts-jest",
            {
                useESM: true,
                tsconfig: "<rootDir>/tsconfig.jest.json",
            },
        ],
    },

    extensionsToTreatAsEsm: [".ts"],

    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
};

export default config;
