import AWS, { AWSClientConfig, prepareCredentials } from '..';

export class CloudWatchClient {
    private readonly INTERVAL = 5;
    private logsClient: AWS.CloudWatchLogs;
    private cloudWatchClient: AWS.CloudWatch;

    constructor(cfg?: Partial<AWSClientConfig>) {
        this.logsClient = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28', ...prepareCredentials(cfg) });
        this.cloudWatchClient = new AWS.CloudWatch({ apiVersion: '2014-03-28', ...prepareCredentials(cfg) });
    }

    public async getLatestDeliveredNotificationDataPoints(topicName: string) {
        const startDate = new Date(new Date().setMinutes(new Date().getMinutes() - this.INTERVAL));
        const endDate = new Date(new Date().setMinutes(new Date().getMinutes() + this.INTERVAL));
        const params = {
            EndTime: endDate,
            Dimensions: [
                {
                    Name: 'TopicName',
                    Value: topicName
                },
            ],
            MetricName: 'NumberOfNotificationsDelivered',
            Namespace: 'AWS/SNS',
            Period: 60,
            Statistics: ['Average'],
            StartTime: startDate,
        };
        try {
            return await this.cloudWatchClient.getMetricStatistics(params).promise();
        } catch (err) {
            throw new Error(`Failed to get Metrics Statistic from ${topicName} with error: ${err}`);
        }
    }

    public async getLogEventsOfLogGroup(groupName: string): Promise<AWS.CloudWatchLogs.OutputLogEvent[]> {
        const streamNames = await this.getLatestLogStreams(groupName);
        const startDate = new Date(new Date().setMinutes(new Date().getMinutes() - this.INTERVAL));
        const logs: AWS.CloudWatchLogs.OutputLogEvent[] = [];
        for (const logStream of streamNames.logStreams!) {
            const events = await this.getLogEventsOfLogStream(groupName, logStream.logStreamName!, startDate);
            if (Array.isArray(events?.events)) {
                logs.push(...events.events);
            }
        }
        return logs;
    }

    private async getLogEventsOfLogStream(groupName: string, logStreamName: string, startDate: string | Date): Promise<AWS.CloudWatchLogs.GetLogEventsResponse> {
        const params: AWS.CloudWatchLogs.GetLogEventsRequest = {
            logGroupName: groupName,
            logStreamName: logStreamName,
            startTime: new Date(startDate).getTime(),
            startFromHead: false
        };
        try {
            return await this.logsClient.getLogEvents(params).promise();
        } catch (err) {
            throw new Error(`Getting log streams from ${groupName} with error ${err}`);
        }
    }

    private async getLatestLogStreams(groupName: string): Promise<AWS.CloudWatchLogs.DescribeLogStreamsResponse> {
        const params: AWS.CloudWatchLogs.DescribeLogStreamsRequest = {
            logGroupName: groupName,
            descending: true,
            limit: 3,
            orderBy: 'LastEventTime'
        };
        try {
            return await this.logsClient.describeLogStreams(params).promise();
        } catch (err) {
            throw new Error(`Getting log streams from ${groupName} failed with error ${err}`)
        }
    }
}