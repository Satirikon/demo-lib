Demo-lib

Simplified ecosystem created to support automation frameworks, send requests and collect data from different AWS services(CloudWatch, Lambda, StepFunction, SQS, Dynamo, S3). Also contains REST-client(axios-based).

src/aws
    Core of the lib

src/aws/config.ts - 
    Handling credentials

src/assertions -
    HTTP Codes Validation for rest client and some JSON validations

src/config -
    Global variables(Timeouts, etc.)

src/rest -
    Axios-based API client

src/utils -
    Basic helpers

Part of the lib was removed, this version is only for showing the codestyle and not representing whole solution