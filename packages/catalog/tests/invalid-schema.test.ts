import { describe, it, expect } from 'vitest';
import { validateSchemas } from '../src/validators/schema';

describe('Schema Validation', () => {
  it('should throw an error for invalid schema', async () => {
    // We pass an invalid organization that is missing 'type' and 'name'
    const invalidData = [{ id: 'org-1' }];
    
    await expect(validateSchemas(invalidData, 'organizations')).rejects.toThrow(/Schema validation failed/);
  });
});
