import * as AWS from 'aws-sdk';

export interface AWSClientConfig {
    region?: string;
    credentials?: {
        accessKeyId: string;
        secretAccessKey: string;
        sessionToken?: string;
    };
}

export function prepareCredentials(cfg: Partial<AWSClientConfig> = {}): AWSClientConfig {
    const result: AWSClientConfig = {
        region: cfg?.region || process.env.REGION || process.env.AWS_REGION,
        credentials: {
            accessKeyId: cfg?.credentials?.accessKeyId || process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: cfg?.credentials?.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY!,
            sessionToken: cfg?.credentials?.sessionToken || process.env.AWS_SESSION_TOKEN
        }
    };
    if(result.credentials?.accessKeyId === undefined || result.credentials?.secretAccessKey === undefined) {
        throw new Error(`Failed to apply credentials`)
    } else {
    return result;
    }
}

export function setUpDefaultCredentials(): void {
    const cfg = prepareCredentials();
    if (cfg.credentials?.accessKeyId && cfg.credentials?.secretAccessKey) {
        console.log('Setting up AWS default credentials');
        AWS.config.update(cfg);
    }
}

export default AWS