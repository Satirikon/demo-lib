import { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { stringify } from 'qs';
import { omit } from 'lodash';
import * as AXIOS from 'axios';

const axios: AXIOS.Axios = AXIOS.default;

export interface AuthParams {
    aud: string;
    grant_type: string;
    scope: string | string[];
    client_id: string;
    client_secret: string;
}

export type RequestConfig = AxiosRequestConfig & {
    token?: string | null;
};

export type Headers = { [key: string]: string };

export const DEFAULT_HEADER: Headers = {
    'Content-Type': 'application/json',
};

export class RestClient {
    private baseUrl: string;
    private token: string;
    private authUrl: string;
    private authParams: AuthParams;

    constructor(baseUrl: string, authUrl?: string, authParams?: AuthParams, token?: string) {
        this.baseUrl = baseUrl.replace(/\/*$/, '');
        if (token) {
            this.token = token;
        } else if (!authUrl || !authParams) {
            throw new Error(`Auth data required. Failed URL to auth: ${authUrl}, failed params: ${authParams}`);
        } else {
            this.authUrl = authUrl;
            this.authParams = authParams;
        }
    }

    private async getHeader(headers: Headers, token?: string | null): Promise<Headers> {
        if (token !== null) {
            if (!token) {
                await this.getToken(this.authParams);
            }
            return {
                ...headers,
                Authorization: `Bearer ${token ? token : this.token}`,
            };
        }
        return headers;
    }

    public async getToken(params?: AuthParams): Promise<string> {
        const requestBody = stringify(params ? params : this.authParams);
        const requestConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
        try {
            const { data } = await axios.post<{ access_token: string }>(this.authUrl, requestBody, requestConfig);
            this.token = `${data.access_token}`;
            return this.token;
        } catch (error) {
            throw new Error(`Unable to get token. Error: ${error}, URL: ${this.authUrl}, Params: ${params}`);
        }
    }

    public getFullUrl(path?: string): string {
        path = path || '';
        return `${this.baseUrl}/${path.replace(/^\/*/, '')}`;
    }

    public async sendRequest<T>(method: Method, path?: string, config: RequestConfig = {}): Promise<AxiosResponse<T>> {
        const url = this.getFullUrl(path);
        const requestConfig: AxiosRequestConfig = {
            method: method.toLowerCase(),
            url,
            baseURL: this.baseUrl,
            headers: await this.getHeader(DEFAULT_HEADER, config?.token),
            ...omit(config || {}, ['token']),
        };
        return axios.request(requestConfig);
    }
}