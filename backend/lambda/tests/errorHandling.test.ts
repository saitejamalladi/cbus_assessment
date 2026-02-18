import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { handler, __setDocumentClient } from '../src/handlers/getCustomers';

const mockSend = jest.fn();

describe('errorHandling', () => {
  beforeEach(() => {
    mockSend.mockReset();
    process.env.CUSTOMERS_TABLE_NAME = 'customers';
    process.env.REGISTRATION_DATE_INDEX = 'registration_date_index';
    __setDocumentClient({ send: mockSend });
  });

  it('returns 400 for invalid pageSize', async () => {
    const event = buildEvent({ pageSize: '200' });
    const response = await handler(event);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body!)).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'pageSize must be between 1 and 100' }
    });
  });

  it('returns 400 for malformed cursor', async () => {
    const event = buildEvent({ cursor: 'not-base64' });
    const response = await handler(event);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body!)).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'cursor is malformed' }
    });
  });

  it('returns 500 for missing env vars', async () => {
    delete process.env.CUSTOMERS_TABLE_NAME;
    const event = buildEvent({});
    const response = await handler(event);
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body!)).toEqual({
      error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' }
    });
  });

  it('returns 500 for DynamoDB errors', async () => {
    mockSend.mockRejectedValue(new Error('DynamoDB error'));
    const event = buildEvent({});
    const response = await handler(event);
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body!)).toEqual({
      error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' }
    });
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
