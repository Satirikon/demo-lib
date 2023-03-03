import { config } from 'dotenv';

export function load() {
    if ([true, 'true', 1, '1'].includes(String(process.env.IS_LOCAL).toLowerCase())) {
        config();
    }
    return process.env;
}

export enum AutomationFramework {
    PLAYWRIGHT = 'playwright',
    JEST = 'jest',
    UNKNOWN = 'unknown',
}
export let AUTOMATION_FRAMEWORK: AutomationFramework;

if (!process.env.AUTOMATION_FRAMEWORK) {
    try {
        require.resolve('@playwright/test');
        AUTOMATION_FRAMEWORK = AutomationFramework.PLAYWRIGHT;
    } catch (error) {
        AUTOMATION_FRAMEWORK = AutomationFramework.JEST;
    }
} else {
    AUTOMATION_FRAMEWORK = process.env.AUTOMATION_FRAMEWORK.toLowerCase() as AutomationFramework;
}