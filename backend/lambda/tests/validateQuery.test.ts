import { __testables } from '../src/handlers/getCustomers';

describe('validateQuery', () => {
  describe('parsePageSize', () => {
    it('returns default when undefined', () => {
      expect(__testables.parsePageSize()).toBe(25);
    });

    it('parses valid numbers', () => {
      expect(__testables.parsePageSize('1')).toBe(1);
      expect(__testables.parsePageSize('100')).toBe(100);
      expect(__testables.parsePageSize('50')).toBe(50);
    });

    it('rejects non-integers', () => {
      expect(() => __testables.parsePageSize('1.5')).toThrow('integer');
      expect(() => __testables.parsePageSize('abc')).toThrow('integer');
    });

    it('rejects out of bounds', () => {
      expect(() => __testables.parsePageSize('0')).toThrow('between 1 and 100');
      expect(() => __testables.parsePageSize('101')).toThrow('between 1 and 100');
    });
  });

  describe('normalizeSearchTerm', () => {
    it('returns undefined for empty or whitespace', () => {
      expect(__testables.normalizeSearchTerm()).toBeUndefined();
      expect(__testables.normalizeSearchTerm('')).toBeUndefined();
      expect(__testables.normalizeSearchTerm('   ')).toBeUndefined();
    });

    it('trims and returns valid terms', () => {
      expect(__testables.normalizeSearchTerm('  Ada  ')).toBe('Ada');
      expect(__testables.normalizeSearchTerm('John')).toBe('John');
    });
  });

  describe('decodeCursor', () => {
    it('returns undefined for no cursor', () => {
      expect(__testables.decodeCursor()).toBeUndefined();
    });

    it('decodes valid base64 json', () => {
      const payload = { id: 'c_1', registration_date: '2024-01-01T00:00:00Z' };
      const cursor = Buffer.from(JSON.stringify(payload)).toString('base64');
      expect(__testables.decodeCursor(cursor)).toEqual(payload);
    });

    it('rejects invalid base64 or json', () => {
      expect(() => __testables.decodeCursor('invalid')).toThrow('malformed');
      expect(() => __testables.decodeCursor('bm90IGpzb24=')).toThrow('malformed'); // base64 for "not json"
      expect(() => __testables.decodeCursor('Im5vdCBhbiBvYmplY3Qi')).toThrow('malformed'); // base64 for "not an object"
    });
  });

  describe('encodeCursor', () => {
    it('returns undefined for no payload', () => {
      expect(__testables.encodeCursor()).toBeUndefined();
    });

    it('encodes payload to base64 json', () => {
      const payload = { id: 'c_1' };
      const cursor = __testables.encodeCursor(payload);
      expect(cursor).toBeTruthy();
      expect(__testables.decodeCursor(cursor)).toEqual(payload);
    });
  });
});
