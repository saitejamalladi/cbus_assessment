import { __testables } from '../src/handlers/getCustomers';

describe('queryCustomers', () => {
  describe('buildQueryInput', () => {
    const baseArgs = {
      tableName: 'customers',
      indexName: 'registration_date_index',
      pageSize: 25,
      searchTerm: undefined,
      exclusiveStartKey: undefined
    };

    it('builds basic query without filter', () => {
      const input = __testables.buildQueryInput(baseArgs);
      expect(input).toMatchObject({
        TableName: 'customers',
        IndexName: 'registration_date_index',
        KeyConditionExpression: '#entity_type = :entity_type',
        ExpressionAttributeNames: { '#entity_type': 'entity_type' },
        ExpressionAttributeValues: { ':entity_type': 'CUSTOMER' },
        Limit: 25,
        ScanIndexForward: false
      });
      expect(input.FilterExpression).toBeUndefined();
    });

    it('includes exclusive start key when provided', () => {
      const startKey = { entity_type: 'CUSTOMER', registration_date: '2024-01-01T00:00:00Z' };
      const input = __testables.buildQueryInput({ ...baseArgs, exclusiveStartKey: startKey });
      expect(input.ExclusiveStartKey).toEqual(startKey);
    });

    it('adds filter expression when search term provided', () => {
      const input = __testables.buildQueryInput({ ...baseArgs, searchTerm: 'Ada' });
      expect(input.FilterExpression).toContain('contains');
      expect(input.ExpressionAttributeNames).toEqual({
        '#entity_type': 'entity_type',
        '#full_name': 'full_name',
        '#email': 'email'
      });
      expect(input.ExpressionAttributeValues).toEqual({
        ':entity_type': 'CUSTOMER',
        ':search': 'Ada'
      });
    });

    it('respects page size', () => {
      const input = __testables.buildQueryInput({ ...baseArgs, pageSize: 10 });
      expect(input.Limit).toBe(10);
    });
  });
});
