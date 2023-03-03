import AWS, { AWSClientConfig, prepareCredentials } from '..';

export class StepFunctionClient {
    private readonly stepFunctionClient: AWS.StepFunctions;
    private readonly stepFunctionArn: string;

    constructor(stepFunctionArn: string, cfg?: Partial<AWSClientConfig>) {
        if (!stepFunctionArn) {
            throw new Error('Missed StepFunctionArn')
        }
        this.stepFunctionClient = new AWS.StepFunctions({ apiVersion: '2016-11-23', ...prepareCredentials(cfg) })
        this.stepFunctionArn = stepFunctionArn;
    }

    public async invoke<T>(input: T): Promise<AWS.StepFunctions.StartExecutionOutput> {
        const params: AWS.StepFunctions.StartExecutionInput = {
            stateMachineArn: this.stepFunctionArn,
            input: JSON.stringify(input),
        };
        try {
            return await this.stepFunctionClient.startExecution(params).promise();
        } catch (error) {
            throw new Error(`Failed to invoke Step Function ${this.stepFunctionArn} with error: ${error}`);
        }
    }

    public async getExecutions({maxResults, nextToken}: {maxResults?: number, nextToken?: string}): Promise<AWS.StepFunctions.ListExecutionsOutput> {
        const params: AWS.StepFunctions.ListExecutionsInput = {
            stateMachineArn: this.stepFunctionArn,
            maxResults: maxResults || 1,
            nextToken
        };
        try {
            return await this.stepFunctionClient.listExecutions(params).promise();
        } catch (error) {
            throw new Error(`Failed to get Step Function ${this.stepFunctionArn} executions with error: ${error}`);
        }
    }

    
    public async getExecutionStepsDetails(executionArn: string): Promise<AWS.StepFunctions.DescribeExecutionOutput> {
        const params: AWS.StepFunctions.DescribeExecutionInput = {
            executionArn
        };
        try {
            return await this.stepFunctionClient.describeExecution(params).promise();
        } catch (error) {
            throw new Error(`Failed to get execution details with error: ${error}`);
        }
    }
}