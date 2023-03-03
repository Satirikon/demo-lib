import { chai } from '../utils/chai';

export const DEFAULT_GLOBAL_WAIT_INTERVAL = 5e3;
export const DEFAULT_GLOBAL_WAIT_TIMEOUT = 6 * DEFAULT_GLOBAL_WAIT_INTERVAL;
export const DEFAULT_GLOBAL_STEP_INTERVAL = 2 * DEFAULT_GLOBAL_WAIT_INTERVAL;
export const DEFAULT_GLOBAL_TEST_INTERVAL = 10 * DEFAULT_GLOBAL_WAIT_INTERVAL;

export const GLOBAL_WAIT_INTERVAL = Number(process.env.DEFAULT_GLOBAL_WAIT_INTERVAL || DEFAULT_GLOBAL_WAIT_INTERVAL);
export const GLOBAL_WAIT_TIMEOUT = Number(process.env.DEFAULT_GLOBAL_WAIT_TIMEOUT || DEFAULT_GLOBAL_WAIT_TIMEOUT);
export const GLOBAL_STEP_INTERVAL = Number(process.env.DEFAULT_GLOBAL_STEP_INTERVAL || DEFAULT_GLOBAL_STEP_INTERVAL);
export const GLOBAL_TEST_INTERVAL = Number(process.env.DEFAULT_GLOBAL_TEST_INTERVAL || DEFAULT_GLOBAL_TEST_INTERVAL);

function assertTimeout(name: string, value: number, limit?: number) {
    chai.expect(typeof value, `${name} must be a number`).to.equal('number');
    chai.expect(value, `${name} must be a number`).to.not.be.NaN;
    chai.expect(value, `${name} must be positive`).to.be.greaterThan(0);
    if (typeof limit === 'number') {
        chai.expect(value, `${name} must be greater than ${limit}`).to.be.greaterThan(limit);
    }
}

assertTimeout('GLOBAL_WAIT_INTERVAL', GLOBAL_WAIT_INTERVAL);
assertTimeout('GLOBAL_WAIT_TIMEOUT', GLOBAL_WAIT_TIMEOUT);
assertTimeout('GLOBAL_STEP_INTERVAL', GLOBAL_STEP_INTERVAL);
assertTimeout('GLOBAL_TEST_INTERVAL', GLOBAL_TEST_INTERVAL);
