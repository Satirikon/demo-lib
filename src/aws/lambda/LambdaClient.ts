import AWS, { AWSClientConfig, prepareCredentials } from '..';

export class LambdaClient {
    private readonly lambdaName: string;

    private readonly client: AWS.Lambda;

    constructor(lambdaName: string, cfg?: Partial<AWSClientConfig>) {
        if (!lambdaName) {
            throw new Error('Lambda Name is not defined');
        }
        this.client = new AWS.Lambda(prepareCredentials(cfg));
        this.lambdaName = lambdaName;
    }

    public async invoke(lambdaPayload: AWS.Lambda._Blob): Promise<AWS.Lambda.Types.InvocationResponse> {
        if (typeof lambdaPayload !== 'string' || !Buffer.isBuffer(lambdaPayload)) {
            //eslint-disable-next-line no param reassing
            lambdaPayload = JSON.stringify(lambdaPayload);
        }
        const params: AWS.Lambda.Types.InvocationRequest = {
            FunctionName: this.lambdaName,
            Payload: lambdaPayload,
        };

        try {
            return await this.client.invoke(params).promise();
        } catch (error) {
            throw new Error(`Lambda ${this.lambdaName} invokation error: ${error}`);
        }
    }
}