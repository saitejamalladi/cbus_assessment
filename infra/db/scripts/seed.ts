import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { faker } from '@faker-js/faker';

const TABLE_NAME = 'customers';
const BATCH_SIZE = 25; // DynamoDB batch write limit
const TOTAL_CUSTOMERS = 2000;

interface Customer {
  id: string;
  entity_type: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  registration_date: string;
}

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true }
});

function generateCustomer(): Customer {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  const registrationDate = faker.date.past({ years: 2 }).toISOString();

  return {
    id: faker.string.uuid(),
    entity_type: 'CUSTOMER',
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    email: email,
    registration_date: registrationDate
  };
}

async function seedCustomers() {
  console.log(`Generating ${TOTAL_CUSTOMERS} customers...`);
  const customers: Customer[] = [];
  for (let i = 0; i < TOTAL_CUSTOMERS; i++) {
    customers.push(generateCustomer());
  }

  console.log('Seeding to DynamoDB...');
  const batches = [];
  for (let i = 0; i < customers.length; i += BATCH_SIZE) {
    batches.push(customers.slice(i, i + BATCH_SIZE));
  }

  for (const batch of batches) {
    const putRequests = batch.map(customer => ({
      PutRequest: { Item: customer }
    }));

    const commandInput = {
      RequestItems: {
        [TABLE_NAME]: putRequests
      }
    };

    try {
      const result = await dynamoClient.send(new BatchWriteCommand(commandInput));
      if (result.UnprocessedItems && Object.keys(result.UnprocessedItems).length > 0) {
        console.warn('Some items were not processed:', result.UnprocessedItems);
      }
    } catch (error: any) {
      if (error.name === 'ResourceNotFoundException') {
        console.error('Error: DynamoDB table not found. Please deploy the CDK stack first.');
        console.error('Run: cd infra/cdk && npm run cdk deploy');
      } else {
        console.error('Error writing batch:', error);
      }
      throw error;
    }
  }

  console.log(`Successfully seeded ${TOTAL_CUSTOMERS} customers.`);
}

seedCustomers().catch(console.error);
