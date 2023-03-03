import * as chai from 'chai';
import chaiExclude from 'chai-exclude';
import * as deepEqualInAnyOrder from 'deep-equal-in-any-order';
import { diff } from 'jest-diff';

chai.use(chaiExclude);
chai.use(deepEqualInAnyOrder);

let originalGetMessage: ((obj: object, args: Chai.AssertionArgs) => string) | null = null;

if(!originalGetMessage) {
    originalGetMessage = chai.util.getMessage;
    Object.defineProperty(chai.util, 'getMessage', {
        value<T>(obj: object, args: Chai.AssertionArgs) {
            const excluding = chai.util.flag(obj, 'excluding') as boolean;
            const excludingProps = chai.util.flag(obj, 'excludingProps') as string[];
            const expected = args[3] as T;
            const actual = chai.util.getActual(obj, args) as T;

            // @ts-ignore
            const msg = originalGetMessage(obj, args);
            let diffMessage: string = diff(expected, actual, {
                expand: false,
            })!;
            if (excluding) {
                diffMessage = diffMessage
                .split('\n')
                .filter((line) => !excludingProps.some((prop) => line.includes(`"${prop}":`)))
                .join('\n');
                return `${msg}\n\nIgnoring properties: ${excludingProps} (removed from the diff)\n\n${diffMessage}`;
            }
            return `${msg}\n\n${diffMessage}`;
        },
        writable: false,
    });
}

function filterObject<T>(obj: T, key: string) {
    for (const i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (i == key) {
            delete obj[key];
        } else if (typeof obj[i] == 'object') {
            filterObject(obj[i], key);
        }
    }
    return obj;
}

export { chai, filterObject}