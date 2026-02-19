import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { handler, __testables, __setDocumentClient } from '../src/handlers/getCustomers';

const mockSend = jest.fn();

describe('getCustomers handler', () => {
  beforeEach(() => {
    mockSend.mockReset();
    process.env.CUSTOMERS_TABLE_NAME = 'customers';
    process.env.REGISTRATION_DATE_INDEX = 'registration_date_index';
    __setDocumentClient({ send: mockSend });
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
    const response = await handler(event);

    expect(mockSend).toHaveBeenCalledTimes(1);
    const command = mockSend.mock.calls[0][0];
    expect(command).toBeInstanceOf(QueryCommand);
    expect(command.input).toMatchObject({
      TableName: 'customers',
      IndexName: 'registration_date_index',
      Limit: 10,
      KeyConditionExpression: '#entity_type = :entity_type',
      ScanIndexForward: false
    });

    const body = JSON.parse(response.body!);
    expect(response.statusCode).toBe(200);
    expect(body.data).toHaveLength(1);
    expect(body.cursor).toBeTruthy();
    expect(body.hasNext).toBe(true);
  });

  it('applies filter expression when q provided', async () => {
    mockSend.mockResolvedValue({ Items: [], LastEvaluatedKey: undefined });

    const event = buildEvent({ q: 'Ada' });
    await handler(event);

    const command = mockSend.mock.calls[0][0];
    expect(command.input.FilterExpression).toContain('contains');
    expect(command.input.ExpressionAttributeValues[':search']).toBe('Ada');
  });

  it('keeps querying until it fills the page when q provided', async () => {
    mockSend
      .mockResolvedValueOnce({
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
      })
      .mockResolvedValueOnce({
        Items: [
          {
            id: 'c_2',
            full_name: 'Grace Hopper',
            email: 'grace@example.com',
            registration_date: '2024-01-02T00:00:00Z'
          }
        ],
        LastEvaluatedKey: undefined
      });

    const event = buildEvent({ pageSize: '2', q: 'a' });
    const response = await handler(event);

    expect(mockSend).toHaveBeenCalledTimes(2);
    const firstCommand = mockSend.mock.calls[0][0];
    const secondCommand = mockSend.mock.calls[1][0];
    expect(firstCommand).toBeInstanceOf(QueryCommand);
    expect(secondCommand).toBeInstanceOf(QueryCommand);
    expect(secondCommand.input.ExclusiveStartKey).toEqual({
      entity_type: 'CUSTOMER',
      registration_date: '2024-01-01T00:00:00Z',
      id: 'c_1'
    });

    const body = JSON.parse(response.body!);
    expect(body.data).toHaveLength(2);
    expect(body.hasNext).toBe(false);
  });

  it('rejects invalid pageSize', async () => {
    const response = await handler(buildEvent({ pageSize: '500' }));
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body!).error.code).toBe('VALIDATION_ERROR');
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('rejects malformed cursor', async () => {
    const response = await handler(buildEvent({ cursor: 'invalid@@' }));
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body!).error.code).toBe('VALIDATION_ERROR');
  });
});

describe('helpers', () => {
  it('validates page size bounds', () => {
    expect(__testables.parsePageSize()).toBe(25);
    expect(__testables.parsePageSize('1')).toBe(1);
    expect(() => __testables.parsePageSize('abc')).toThrow('integer');
  });

  it('encodes and decodes cursor payloads', () => {
    const payload = { id: 'c_1' };
    const cursor = __testables.encodeCursor(payload);
    expect(cursor).toBeTruthy();
    expect(__testables.decodeCursor(cursor)).toEqual(payload);
  });
});

const buildEvent = (params: Record<string, string | undefined>): APIGatewayProxyEventV2 => ({
  version: '2.0',
  routeKey: '',
  rawPath: '/customers',
  rawQueryString: '',
  headers: {},
  requestContext: {} as never,
  isBase64Encoded: false,
  stageVariables: undefined,
  body: undefined,
  pathParameters: undefined,
  cookies: [],
  queryStringParameters: params
});
