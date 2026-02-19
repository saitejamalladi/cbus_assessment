import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;
const MIN_PAGE_SIZE = 1;
const MAX_SEARCH_QUERIES = 10;
const ENTITY_TYPE = 'CUSTOMER';
const ENTITY_TYPE_ATTR = 'entity_type';
const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

let dynamoClient: Pick<DynamoDBDocumentClient, 'send'> = DynamoDBDocumentClient.from(
  new DynamoDBClient({}),
  {
    marshallOptions: { removeUndefinedValues: true }
  }
);

type CustomerItem = {
  id: string;
  full_name: string;
  email: string;
  registration_date: string;
};

type CustomerResponse = {
  id: string;
  fullName: string;
  email: string;
  registrationDate: string;
};

type CursorPayload = Record<string, unknown>;

const ok = (payload: Record<string, unknown>): APIGatewayProxyStructuredResultV2 => ({
  statusCode: 200,
  headers: CORS_HEADERS,
  body: JSON.stringify(payload)
});

const badRequest = (message: string): APIGatewayProxyStructuredResultV2 => ({
  statusCode: 400,
  headers: CORS_HEADERS,
  body: JSON.stringify({ error: { code: 'VALIDATION_ERROR', message } })
});

const serverError = (): APIGatewayProxyStructuredResultV2 => ({
  statusCode: 500,
  headers: CORS_HEADERS,
  body: JSON.stringify({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } })
});

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const tableName = process.env.CUSTOMERS_TABLE_NAME;
    const indexName = process.env.REGISTRATION_DATE_INDEX;

    if (!tableName || !indexName) {
      console.error('Missing table or index environment variables');
      return serverError();
    }

    const queryParams = event.queryStringParameters ?? {};
    let pageSize: number;
    try {
      pageSize = parsePageSize(queryParams.pageSize);
    } catch (error) {
      return badRequest((error as Error).message);
    }

    let exclusiveStartKey: CursorPayload | undefined;
    try {
      exclusiveStartKey = decodeCursor(queryParams.cursor);
    } catch (error) {
      return badRequest((error as Error).message);
    }

    const searchTerm = normalizeSearchTerm(queryParams.q);

    const { items, lastEvaluatedKey } = await queryCustomers({
      tableName,
      indexName,
      pageSize,
      searchTerm,
      exclusiveStartKey
    });

    const hasNext = Boolean(lastEvaluatedKey);
    const cursor = encodeCursor(lastEvaluatedKey as CursorPayload | undefined);

    return ok({
      data: items,
      pageSize,
      hasNext,
      ...(cursor ? { cursor } : {})
    });
  } catch (error) {
    console.error('Unhandled error while fetching customers', error);
    return serverError();
  }
};

type QueryCustomersArgs = {
  tableName: string;
  indexName: string;
  pageSize: number;
  searchTerm?: string;
  exclusiveStartKey?: CursorPayload;
};

const queryCustomers = async ({
  tableName,
  indexName,
  pageSize,
  searchTerm,
  exclusiveStartKey
}: QueryCustomersArgs): Promise<{ items: CustomerResponse[]; lastEvaluatedKey?: CursorPayload }> => {
  // Without a search term, a single Query is sufficient.
  if (!searchTerm) {
    const queryInput = buildQueryInput({
      tableName,
      indexName,
      pageSize,
      searchTerm,
      exclusiveStartKey
    });

    const result = await dynamoClient.send(new QueryCommand(queryInput));
    return {
      items: (result.Items ?? []).map(mapCustomer),
      lastEvaluatedKey: result.LastEvaluatedKey as CursorPayload | undefined
    };
  }

  // With a search term, DynamoDB applies FilterExpression after reading a page.
  // Loop to accumulate up to pageSize matching items (bounded to avoid long runtimes).
  const collected: CustomerResponse[] = [];
  let lastEvaluatedKey: CursorPayload | undefined = exclusiveStartKey;

  for (let i = 0; i < MAX_SEARCH_QUERIES && collected.length < pageSize; i += 1) {
    const remaining = pageSize - collected.length;
    const queryInput = buildQueryInput({
      tableName,
      indexName,
      pageSize: remaining,
      searchTerm,
      exclusiveStartKey: lastEvaluatedKey
    });

    const result = await dynamoClient.send(new QueryCommand(queryInput));
    const pageItems = (result.Items ?? []).map(mapCustomer);
    collected.push(...pageItems);
    lastEvaluatedKey = result.LastEvaluatedKey as CursorPayload | undefined;

    if (!lastEvaluatedKey) {
      break;
    }
  }

  return { items: collected, lastEvaluatedKey };
};

type BuildQueryInputArgs = {
  tableName: string;
  indexName: string;
  pageSize: number;
  searchTerm?: string;
  exclusiveStartKey?: CursorPayload;
};

const buildQueryInput = ({
  tableName,
  indexName,
  pageSize,
  searchTerm,
  exclusiveStartKey
}: BuildQueryInputArgs): QueryCommandInput => {
  const expressionAttributeNames: Record<string, string> = {
    '#entity_type': ENTITY_TYPE_ATTR
  };
  const expressionAttributeValues: Record<string, unknown> = {
    ':entity_type': ENTITY_TYPE
  };

  const queryInput: QueryCommandInput = {
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

const mapCustomer = (item: Partial<CustomerItem>): CustomerResponse => ({
  id: coerceString(item.id, 'id'),
  fullName: coerceString(item.full_name, 'full_name'),
  email: coerceString(item.email, 'email'),
  registrationDate: coerceString(item.registration_date, 'registration_date')
});

const coerceString = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || !value.length) {
    throw new Error(`Invalid customer field: ${field}`);
  }
  return value;
};

const parsePageSize = (value?: string): number => {
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

const normalizeSearchTerm = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const decodeCursor = (cursor?: string): CursorPayload | undefined => {
  if (!cursor) {
    return undefined;
  }
  try {
    const json = Buffer.from(cursor, 'base64').toString('utf8');
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid cursor payload');
    }
    return parsed as CursorPayload;
  } catch (error) {
    console.error('Failed to decode cursor', error);
    throw new Error('cursor is malformed');
  }
};

const encodeCursor = (payload?: CursorPayload): string | undefined => {
  if (!payload) {
    return undefined;
  }
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

export const __testables = {
  parsePageSize,
  normalizeSearchTerm,
  decodeCursor,
  encodeCursor,
  buildQueryInput,
  mapCustomer
};

export const __setDocumentClient = (client: Pick<DynamoDBDocumentClient, 'send'>): void => {
  dynamoClient = client;
};
