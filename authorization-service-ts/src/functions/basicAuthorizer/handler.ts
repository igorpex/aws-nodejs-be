import {APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerHandler} from "aws-lambda";
import {middyfy} from '@libs/lambda';

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event, _ctx, cb) => {
    if (event['type'] !== 'TOKEN') {
        cb('Unauthorized');
    }
    // console.log('cb:', cb);
    try {
        const {authorizationToken} = event || {};

        const encodedCreds = authorizationToken.split(' ')[1];
        const buff = Buffer.from(encodedCreds, 'base64');
        const plainCreds = buff.toString('utf-8').split(':');
        const username = plainCreds[0];
        const password = plainCreds[1];

        console.log(`username: ${username} and password: ${password}`);

        const storedUserPassword = process.env[username];

        const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

        const policy = generatePolicy(encodedCreds, event.methodArn, effect);

        cb(null, policy);

        return policy;
    } catch (e) {
        cb(`Unauthorized: ${e.message}`);
    }
};

function generatePolicy(
    principalId: string,
    resource: string,
    effect: 'Allow' | 'Deny' = 'Allow'
): APIGatewayAuthorizerResult {
    return {
        principalId: principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        },
    };
};

export const main = middyfy(basicAuthorizer);
