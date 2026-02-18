"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__setDocumentClient = exports.__testables = exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;
const MIN_PAGE_SIZE = 1;
const ENTITY_TYPE = 'CUSTOMER';
const ENTITY_TYPE_ATTR = 'entity_type';
const CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
};
let dynamoClient = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({}), {
    marshallOptions: { removeUndefinedValues: true }
});
const ok = (payload) => ({
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(payload)
});
const badRequest = (message) => ({
    statusCode: 400,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: { code: 'VALIDATION_ERROR', message } })
});
const serverError = () => ({
    statusCode: 500,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } })
});
const handler = async (event) => {
    try {
        const tableName = process.env.CUSTOMERS_TABLE_NAME;
        const indexName = process.env.REGISTRATION_DATE_INDEX;
        if (!tableName || !indexName) {
            console.error('Missing table or index environment variables');
            return serverError();
        }
        const queryParams = event.queryStringParameters ?? {};
        let pageSize;
        try {
            pageSize = parsePageSize(queryParams.pageSize);
        }
        catch (error) {
            return badRequest(error.message);
        }
        let exclusiveStartKey;
        try {
            exclusiveStartKey = decodeCursor(queryParams.cursor);
        }
        catch (error) {
            return badRequest(error.message);
        }
        const searchTerm = normalizeSearchTerm(queryParams.q);
        const queryInput = buildQueryInput({
            tableName,
            indexName,
            pageSize,
            searchTerm,
            exclusiveStartKey
        });
        const result = await dynamoClient.send(new lib_dynamodb_1.QueryCommand(queryInput));
        const items = (result.Items ?? []).map(mapCustomer);
        const hasNext = Boolean(result.LastEvaluatedKey);
        const cursor = encodeCursor(result.LastEvaluatedKey);
        return ok({
            data: items,
            pageSize,
            hasNext,
            ...(cursor ? { cursor } : {})
        });
    }
    catch (error) {
        console.error('Unhandled error while fetching customers', error);
        return serverError();
    }
};
exports.handler = handler;
const buildQueryInput = ({ tableName, indexName, pageSize, searchTerm, exclusiveStartKey }) => {
    const expressionAttributeNames = {
        '#entity_type': ENTITY_TYPE_ATTR
    };
    const expressionAttributeValues = {
        ':entity_type': ENTITY_TYPE
    };
    const queryInput = {
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: '#entity_type = :entity_type',
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        Limit: pageSize,
        ExclusiveStartKey: exclusiveStartKey,
        ScanIndexForward: false
    };
    if (searchTerm) {
        expressionAttributeNames['#full_name'] = 'full_name';
        expressionAttributeNames['#email'] = 'email';
        expressionAttributeValues[':search'] = searchTerm;
        queryInput.FilterExpression = 'contains(#full_name, :search) OR contains(#email, :search)';
    }
    return queryInput;
};
const mapCustomer = (item) => ({
    id: coerceString(item.id, 'id'),
    fullName: coerceString(item.full_name, 'full_name'),
    email: coerceString(item.email, 'email'),
    registrationDate: coerceString(item.registration_date, 'registration_date')
});
const coerceString = (value, field) => {
    if (typeof value !== 'string' || !value.length) {
        throw new Error(`Invalid customer field: ${field}`);
    }
    return value;
};
const parsePageSize = (value) => {
    if (value === undefined) {
        return DEFAULT_PAGE_SIZE;
    }
    const parsed = Number(value);
    if (!Number.isInteger(parsed)) {
        throw new Error('pageSize must be an integer');
    }
    if (parsed < MIN_PAGE_SIZE || parsed > MAX_PAGE_SIZE) {
        throw new Error(`pageSize must be between ${MIN_PAGE_SIZE} and ${MAX_PAGE_SIZE}`);
    }
    return parsed;
};
const normalizeSearchTerm = (value) => {
    if (!value) {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
};
const decodeCursor = (cursor) => {
    if (!cursor) {
        return undefined;
    }
    try {
        const json = Buffer.from(cursor, 'base64').toString('utf8');
        const parsed = JSON.parse(json);
        if (!parsed || typeof parsed !== 'object') {
            throw new Error('Invalid cursor payload');
        }
        return parsed;
    }
    catch (error) {
        console.error('Failed to decode cursor', error);
        throw new Error('cursor is malformed');
    }
};
const encodeCursor = (payload) => {
    if (!payload) {
        return undefined;
    }
    return Buffer.from(JSON.stringify(payload)).toString('base64');
};
exports.__testables = {
    parsePageSize,
    normalizeSearchTerm,
    decodeCursor,
    encodeCursor,
    buildQueryInput,
    mapCustomer
};
const __setDocumentClient = (client) => {
    dynamoClient = client;
};
exports.__setDocumentClient = __setDocumentClient;
