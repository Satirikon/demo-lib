module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    reporters: [
        'default',
        ['jest-junit', { outputDirectory: 'test-reports/' }],
        [
            './node_modules/jest-html-reporter',
            {
                pageTitle: 'CDK Test Report',
                includeFailureMsg: true,
                includeConsoleLog: true,
            },
        ],
    ],
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['__tests__/util', '/node_modules/'],
    modulePathIgnorePatterns: ['dist'],
    testPathIgnorePaterns: ['__tests__/util'],
    watchPathIgnorePatterns: ['node_modules'],
    coverageDirectory: 'test-reports/',
    coverageThreshold: {
        global: {
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
};