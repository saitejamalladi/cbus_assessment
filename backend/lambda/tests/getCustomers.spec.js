"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const getCustomers_1 = require("../src/handlers/getCustomers");
const mockSend = jest.fn();
describe('getCustomers handler', () => {
    beforeEach(() => {
        mockSend.mockReset();
        process.env.CUSTOMERS_TABLE_NAME = 'customers';
        process.env.REGISTRATION_DATE_INDEX = 'registration_date_index';
        (0, getCustomers_1.__setDocumentClient)({ send: mockSend });
    });
    it('returns customers with cursor metadata', async () => {
        mockSend.mockResolvedValue({
            Items: [
                {
                    id: 'c_1',
                    full_name: 'Ada Lovelace',
                    email: 'ada@example.com',
                    registration_date: '2024-01-01T00:00:00Z'
                }
            ],
            LastEvaluatedKey: {
                entity_type: 'CUSTOMER',
                registration_date: '2024-01-01T00:00:00Z',
                id: 'c_1'
            }
        });
        const event = buildEvent({ pageSize: '10' });
        const response = await (0, getCustomers_1.handler)(event);
        expect(mockSend).toHaveBeenCalledTimes(1);
        const command = mockSend.mock.calls[0][0];
        expect(command).toBeInstanceOf(lib_dynamodb_1.QueryCommand);
        expect(command.input).toMatchObject({
            TableName: 'customers',
            IndexName: 'registration_date_index',
            Limit: 10,
            KeyConditionExpression: '#entity_type = :entity_type',
            ScanIndexForward: false
        });
        const body = JSON.parse(response.body);
        expect(response.statusCode).toBe(200);
        expect(body.data).toHaveLength(1);
        expect(body.cursor).toBeTruthy();
        expect(body.hasNext).toBe(true);
    });
    it('applies filter expression when q provided', async () => {
        mockSend.mockResolvedValue({ Items: [], LastEvaluatedKey: undefined });
        const event = buildEvent({ q: 'Ada' });
        await (0, getCustomers_1.handler)(event);
        const command = mockSend.mock.calls[0][0];
        expect(command.input.FilterExpression).toContain('contains');
        expect(command.input.ExpressionAttributeValues[':search']).toBe('Ada');
    });
    it('rejects invalid pageSize', async () => {
        const response = await (0, getCustomers_1.handler)(buildEvent({ pageSize: '500' }));
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).error.code).toBe('VALIDATION_ERROR');
        expect(mockSend).not.toHaveBeenCalled();
    });
    it('rejects malformed cursor', async () => {
        const response = await (0, getCustomers_1.handler)(buildEvent({ cursor: 'invalid@@' }));
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).error.code).toBe('VALIDATION_ERROR');
    });
});
describe('helpers', () => {
    it('validates page size bounds', () => {
        expect(getCustomers_1.__testables.parsePageSize()).toBe(25);
        expect(getCustomers_1.__testables.parsePageSize('1')).toBe(1);
        expect(() => getCustomers_1.__testables.parsePageSize('abc')).toThrow('integer');
    });
    it('encodes and decodes cursor payloads', () => {
        const payload = { id: 'c_1' };
        const cursor = getCustomers_1.__testables.encodeCursor(payload);
        expect(cursor).toBeTruthy();
        expect(getCustomers_1.__testables.decodeCursor(cursor)).toEqual(payload);
    });
});
const buildEvent = (params) => ({
    version: '2.0',
    routeKey: '',
    rawPath: '/customers',
    rawQueryString: '',
    headers: {},
    requestContext: {},
    isBase64Encoded: false,
    stageVariables: undefined,
    body: undefined,
    pathParameters: undefined,
    cookies: [],
    queryStringParameters: params
});
