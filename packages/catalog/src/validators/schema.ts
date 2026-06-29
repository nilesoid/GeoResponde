import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs/promises';
import path from 'path';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

async function loadSchema(schemaName: string) {
  const schemaPath = path.resolve(__dirname, `../../../../data/catalog/${schemaName}.schema.json`);
  const content = await fs.readFile(schemaPath, 'utf8');
  return JSON.parse(content);
}

export async function validateSchemas(data: any, schemaName: string): Promise<void> {
  const schema = await loadSchema(schemaName);
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    const errors = validate.errors?.map(e => `${e.instancePath} ${e.message}`).join(', ');
    throw new Error(`Schema validation failed for ${schemaName}: ${errors}`);
  }
}
