import { chai } from '../utils/chai';
import { StatusCodes } from 'http-status-codes';
import { AxiosError, AxiosResponse } from 'axios';
export { StatusCodes } from 'http-status-codes';

export function checkHTTPStatus(
    response: AxiosResponse | AxiosError,
    statusCode: StatusCodes | number,
    statusText?: string,
) {
    return async () => {
        if ((response as unknown as AxiosError).response) {
            response = (response as unknown as AxiosError).response;
        }
        const rsp = response as AxiosResponse;
        chai.expect(rsp.status, `Response Data: ${JSON.stringify(rsp.data, null, 2)}`).to.equal(statusCode);
        if (statusText) {
            chai.expect(rsp.statusText, `Response Data: ${JSON.stringify(rsp.data, null, 2)}`).to.equal(statusText);
        }
    };
}

export function checkHTTPStatus200(response: AxiosResponse | AxiosError) {
    return checkHTTPStatus(response, StatusCodes.OK, 'OK');
}

export function checkHTTPStatus201(response: AxiosResponse | AxiosError) {
    return checkHTTPStatus(response, StatusCodes.CREATED, 'Created');
}

export function checkHTTPStatus202(response: AxiosResponse | AxiosError) {
    return checkHTTPStatus(response, StatusCodes.ACCEPTED, 'Accepted');
}

export function checkHTTPStatus400(response: AxiosResponse | AxiosError) {
    return checkHTTPStatus(response, StatusCodes.BAD_REQUEST, 'Bad request');
}

export function checkHTTPStatus401(response: AxiosResponse | AxiosError) {
    return checkHTTPStatus(response, StatusCodes.UNAUTHORIZED, 'Unauthorized');
}

export function checkHTTPStatus403(response: AxiosResponse | AxiosError) {
    return checkHTTPStatus(response, StatusCodes.FORBIDDEN, 'Forbidden');
}

export function checkHTTPStatus422(response: AxiosResponse | AxiosError) {
    return checkHTTPStatus(response, StatusCodes.UNPROCESSABLE_ENTITY, 'Unprocessable Entity');
}

export function checkResponseMessage(response: AxiosResponse, expected: string) {
    return async () => {
        chai.expect(response.data).to.equal(expected)
    };
}

export function checkResponseEqual(response: AxiosResponse, expected: AxiosResponse) {
    return async () => {
        chai.expect(response.status).to.equal(expected.status);
        chai.expect(response.data).to.equal(expected.data);
    };
}