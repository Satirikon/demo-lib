import AWS, { AWSClientConfig, prepareCredentials } from '..';

export interface Message {
    MessageBody: string | unknown;
    MessageAttributes?: AWS.SQS.MessageBodyAttributeMap;
    DelaySeconds?: number
}

export class SQSClient {
    private readonly sqsClient: AWS.SQS;
    private readonly queueUrl: string;

    constructor(queueUrl: string, cfg?: Partial<AWSClientConfig>) {
        this.sqsClient = new AWS.SQS(prepareCredentials(cfg));
        this.queueUrl = queueUrl;
    }

    public async sendEvent({ MessageBody, MessageAttributes, DelaySeconds }: Message): Promise<AWS.SQS.SendMessageResult> {
        if (typeof MessageBody !== 'string') {
            MessageBody = JSON.stringify(MessageBody);
        };
        const msg: AWS.SQS.SendMessageRequest = {
            QueueUrl: this.queueUrl,
            MessageBody: MessageBody as string,
            DelaySeconds: DelaySeconds || 0
        };
        if (MessageAttributes) {
            msg.MessageAttributes = MessageAttributes;
        }
        try {
            return await this.sqsClient.sendMessage(msg).promise();
        } catch (error) {
            throw new Error(`Failed to send message to ${this.queueUrl} with error: ${error}`);
        }
    }

    public async getMessages(): Promise<AWS.SQS.ReceiveMessageResult> {
        const params: AWS.SQS.ReceiveMessageRequest = {
            QueueUrl: this.queueUrl,
            MaxNumberOfMessages: 10,
            VisibilityTimeout: 20,
            WaitTimeSeconds: 0,
        };
        try {
            return await this.sqsClient.receiveMessage(params).promise();
        } catch (error) {
            throw new Error(`Failed to get messages from sqs ${this.queueUrl} with error: ${error}`);
        }
    }
}