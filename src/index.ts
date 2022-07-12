// ref:
// - https://umijs.org/plugins/api
import { readFileSync } from 'fs';
import lodash from 'lodash';
import { join } from 'path';
import { IApi } from 'umi';
import { getModels } from './utils/getModels';
import { getTmpFile } from './utils/getTmpFile';
import { withTmpPath } from './utils/withTmpPath';

export default function (api: IApi) {
  api.logger.info('use rematch plugin');

  api.describe({
    key: 'rematch',
  });

  const { paths } = api;

  function getAllModels() {
    return lodash.uniq([
      ...getModels(paths.absSrcPath, `**/models/**/*.rm.{ts,tsx,js,jsx}`),
    ]);
  }

  api.addRuntimePlugin(() => {
    return [withTmpPath({ api, path: 'runtime.tsx' })];
  });

  api.onGenerateFiles(() => {
    const files = getAllModels();
    const tmpFiles = getTmpFile(files, paths.absSrcPath);

    // provider.tsx
    api.writeTmpFile({
      path: `index.tsx`,
      content: tmpFiles.providerContent,
    });

    api.writeTmpFile({
      path: `runtime.tsx`,
      content: readFileSync(join(__dirname, 'runtime.tsx.tpl'), 'utf-8'),
    });

    api.writeTmpFile({
      path: 'types.d.ts',
      content: `
export type { RootModel, RootState } from '.';
      `,
    });
  });
}
