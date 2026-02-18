import { __testables } from '../src/handlers/getCustomers';

describe('responseMapping', () => {
  describe('mapCustomer', () => {
    it('maps valid item to response shape', () => {
      const item = {
        id: 'c_123',
        full_name: 'Jane Doe',
        email: 'jane@example.com',
        registration_date: '2024-10-01T12:00:00Z'
      };
      const result = __testables.mapCustomer(item);
      expect(result).toEqual({
        id: 'c_123',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        registrationDate: '2024-10-01T12:00:00Z'
      });
    });

    it('throws on missing required fields', () => {
      expect(() => __testables.mapCustomer({})).toThrow('Invalid customer field: id');
      expect(() => __testables.mapCustomer({ id: 'c_1' })).toThrow('Invalid customer field: full_name');
      expect(() => __testables.mapCustomer({ id: 'c_1', full_name: 'Name' })).toThrow('Invalid customer field: email');
      expect(() => __testables.mapCustomer({ id: 'c_1', full_name: 'Name', email: 'email@test.com' })).toThrow('Invalid customer field: registration_date');
    });

    it('throws on empty strings', () => {
      const item = {
        id: '',
        full_name: 'Jane Doe',
        email: 'jane@example.com',
        registration_date: '2024-10-01T12:00:00Z'
      };
      expect(() => __testables.mapCustomer(item)).toThrow('Invalid customer field: id');
    });
  });
});
