import path from 'path';
import { glob } from 'umi/plugin-utils';

export function getModels(cwd: string, pattern?: string) {
  const files = glob
    .sync(pattern || '**/*.{ts,tsx,js,jsx}', {
      cwd,
    })
    .filter(
      (file: string) =>
        !file.endsWith('.d.ts') &&
        !file.endsWith('.test.js') &&
        !file.endsWith('.test.jsx') &&
        !file.endsWith('.test.ts') &&
        !file.endsWith('.test.tsx'),
    );

  return files
    .map((file) => {
      return path.join(cwd, file);
    })
    .filter((ele) => !!ele) as string[];
}
