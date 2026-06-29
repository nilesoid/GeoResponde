import fs from 'fs/promises';
import yaml from 'yaml';
import path from 'path';

export async function readYaml<T>(filePath: string): Promise<T[]> {
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const parsed = yaml.parse(fileContents);
    return parsed || [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw new Error(`Failed to parse YAML file ${filePath}: ${(error as Error).message}`);
  }
}

export async function writeJson(filePath: string, data: any): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}
