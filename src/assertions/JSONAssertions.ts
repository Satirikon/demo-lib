import { chai, filterObject } from '../utils/chai';

type ExpectedParametersType = string | boolean | number | Record<string, unknown>;

export class JSONAssertions {
    public logData = false;

    public checkJSONBody<T>(
        actual: T,
        expected: T,
        paramToIgnore: (keyof T)[] = [],
        message = 'Check if expected and actual JSON data are the same',
    ) {
        return async () => {
            chai.assert.deepEqualExcludingEvery(
                actual,
                expected,
                paramToIgnore,
                `Following check has been failed: ${message}`,
            );
        };
    }

    public checkJSONBodyIgnoreOrdering<T>(
        actual: T,
        expected: T,
        paramToIgnore: (keyof T)[] = [],
        message = 'Check if expected and actual JSON data are the same (ignoring element order)',
    ) {
        return async () => {
            let filteredActual = actual;
            let filteredExpected = expected;
            paramToIgnore.forEach((el) => {
                filteredActual = filterObject(actual, el as string);
                filteredExpected = filterObject(expected, el as string);
            });
            chai
                .expect(filteredActual).to.deep.equalInAnyOrder(filteredExpected, `Following checks has been failed: ${message}`);
        };
    }

    public checkParametersInJSON<T>(
        actual: T,
        expectedParameters: { [key: string]: ExpectedParametersType }
    ) {
        return async () => {
            let logMessage = '';
            for (const key in expectedParameters) {
                logMessage = logMessage.concat(`${key} : ${expectedParameters[key]} =--\n  `);
            }
            let isContain = true;
            for (const key in expectedParameters) {
                try {
                    chai.expect(actual).to.have.deep.nested.property(key, expectedParameters[key]);
                } catch (error) {
                    isContain = false
                }
            }
            chai
                .expect(isContain, `The JSON ${JSON.stringify(actual)} doesn't contains following parameters ${logMessage}`)
                .to.equal(true);
        };
    }
}

const jsonAssertions = new JSONAssertions();
export default jsonAssertions; 