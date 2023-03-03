import AWS, { AWSClientConfig, prepareCredentials } from '..';

export class DynamoClient {
    private readonly dynamoDocumentClient: AWS.DynamoDB.DocumentClient;
    private readonly tableName: string;

    constructor(tableName: string, cfg?: Partial<AWSClientConfig>) {
        if (!tableName) {
            throw new Error('Missed table name');
        }

        this.dynamoDocumentClient = new AWS.DynamoDB.DocumentClient({
            apiVersion: '2015-03-31',
            signatureCache: false,
            ...prepareCredentials(cfg)
        });
        this.tableName = tableName;
    }

    public async getRecord(
        primaryKey: string,
        sortKey?: string,
        getRecordParams?: Omit<AWS.DynamoDB.DocumentClient.GetItemInput, 'Key' | 'TableName'>
    ): Promise<AWS.DynamoDB.DocumentClient.GetItemOutput> {
        const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
            ...(getRecordParams || {}),
            TableName: this.tableName,
            Key: {
                pk: primaryKey
            }
        };

        if (sortKey) {
            params.Key.sk = sortKey
        };

        try {
            return await this.dynamoDocumentClient.get(params).promise();
        } catch (error) {
            throw new Error(`Getting record failed: ${error}`);
        }
    }

    public async updateRecord<T>(
        primaryKey: string,
        updateData: T,
        sortKey?: string
    ): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput> {
        const updateExpressions: string[] = [];
        const attributeValues: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap = {};

        for (const columnKey in updateData) {
            updateExpressions.push(`${columnKey}=:${columnKey}`);
            attributeValues[`:${columnKey}`] = updateData[columnKey];
        }

        const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: this.tableName,
            Key: {
                pk: primaryKey,
            },
            UpdateExpression: `set ${updateExpressions.join(',')}`,
            ExpressionAttributeValues: attributeValues,
        };

        if (sortKey) {
            params.Key.sk = sortKey
        }

        try {
            return await this.dynamoDocumentClient.update(params).promise();
        } catch (error) {
            throw new Error(`Record update failed: ${error}`);
        }
    }

    public async deleteRecord(primaryKey: string, sortKey: string): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput> {
        const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
            TableName: this.tableName,
            Key: {
                pk: primaryKey,
                sk: sortKey,
            },
        };

        try {
            return await this.dynamoDocumentClient.delete(params).promise();
        } catch (error) {
            throw new Error(`Record deletion failed: ${error}`);
        }
    }

    public async getRecordByQuery<T>(queryParameters?: AWS.DynamoDB.DocumentClient.QueryInput): Promise<T[]> {
        const records: T[] = [];
        let exclusiveStartKey: AWS.DynamoDB.DocumentClient.Key;
        let result: AWS.DynamoDB.DocumentClient.QueryOutput;
        do {
            try {
                result = await this.dynamoDocumentClient
                .query({
                    ...queryParameters,
                    TableName: this.tableName,
                    ExclusiveStartKey: exclusiveStartKey!
                })
                .promise();
                exclusiveStartKey = result.LastEvaluatedKey!;
                if (result && result.Items) {
                    records.push(...(result.Items as T[]));
                }
            } catch (error) {
                throw new Error(`Failed to get items from DB with error: ${error} . Request params: ${queryParameters}`);
            }
        } while (exclusiveStartKey);
        return records;
    }
}