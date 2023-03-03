import fs from 'fs';
import AWS, { AWSClientConfig, prepareCredentials } from '..';

export class S3Client {
    private readonly client: AWS.S3;
    public readonly bucketName: string;
    public readonly bucketPrefix: string;

    constructor(bucketName: string, bucketPrefix: string, cfg?: Partial<AWSClientConfig>) {
        if (!bucketName || !bucketPrefix) {
            throw new Error('Missed bucket name or prefix');        
        }
        this.bucketName = bucketName;
        this.bucketPrefix = bucketPrefix;
        this.client = new AWS.S3(prepareCredentials(cfg));
    }

    public static trimPath(path: string): string {
        return path.replace(/(^\/|\/)/g, '');
    }

    public static joinPath(...pieces: string[]): string {
        return pieces.map(this.trimPath).join('/');
    }

    public toString(key?: string) {
        if (key) {
            return `s3://${S3Client.joinPath(this.bucketName, this.bucketPrefix, key)}`;
        }
        return `s3://${S3Client.joinPath(this.bucketName, this.bucketPrefix)}`
    }

    public async putFile(key: string, fileName: string): Promise<AWS.S3.PutObjectOutput> {
        const fileContent = fs.readFileSync(fileName);
        return this.putObject(key, fileContent);
    }

    public async putObject(key: string, body: AWS.S3.Body): Promise<AWS.S3.PutObjectOutput> {
        const params: AWS.S3.PutObjectRequest = {
            Bucket: this.bucketName,
            Key: S3Client.joinPath(this.bucketPrefix, key),
            Body: body,
        };
        try {
            return await this.client.putObject(params).promise();
        } catch (error) {
            throw new Error(`Unable to put object to ${this.toString(key)} with error: ${error}`);
        }
    }

    public async getObject(key: string): Promise<AWS.S3.GetObjectOutput> {
        const params: AWS.S3.GetObjectRequest = {
            Bucket: this.bucketName,
            Key: S3Client.joinPath(this.bucketPrefix, key),
        };
        try {
            return await this.client.getObject(params).promise();
        } catch (error) {
            throw new Error(`Unable to get file from ${this.toString(key)} with error: ${error}`);
        }
    }

    public async deleteObject(key: string): Promise<AWS.S3.DeleteObjectOutput> {
        const params: AWS.S3.DeleteObjectRequest = {
            Bucket: this.bucketName,
            Key: S3Client.joinPath(this.bucketPrefix, key),
        };
        try {
            return await this.client.deleteObject(params).promise();
        } catch (error) {
            throw new Error(`Unable to delete object from ${this.toString(key)} with error: ${error}`);
        }
    }

    public async listObjects(): Promise<AWS.S3.ListObjectsOutput> {
        const params: AWS.S3.ListObjectsRequest = {
            Bucket: this.bucketName,
            Prefix: this.bucketPrefix,
        };
        try {
            return await this.client.listObjects(params).promise();
        } catch (error) {
            throw new Error(`Unable to get list of objects from ${this.toString()} with error: ${error}`);
        }
    }
}