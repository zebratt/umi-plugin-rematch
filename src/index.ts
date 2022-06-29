// ref:
// - https://umijs.org/plugins/api
import { IApi } from '@umijs/types';
import { readFileSync } from 'fs';
import { join } from 'path';
import { utils } from 'umi';
import lodash from 'lodash';
import { getModels } from './utils/getModels';
import { getTmpFile } from './utils/getTmpFile';

const DIR_NAME = 'plugin-rematch';

const { winPath } = utils;

export default function(api: IApi) {
  api.logger.info('use rematch plugin');

  const { paths } = api;

  function getModelsPath() {
    return join(paths.absSrcPath!, 'models');
  }

  function getAllModels() {
    const srcModelsPath = getModelsPath();

    return lodash.uniq([
      ...getModels(srcModelsPath),
      ...getModels(paths.absPagesPath!, `**/models/**/*.{ts,tsx,js,jsx}`),
    ]);
  }

  api.addUmiExports(() => [
    {
      exportAll: true,
      source: winPath(`../${DIR_NAME}/Provider`),
    },
  ]);

  api.addRuntimePlugin(() => `../${DIR_NAME}/runtime`);

  api.onGenerateFiles(() => {
    const files = getAllModels();
    const tmpFiles = getTmpFile(files, paths.absSrcPath!);

    // provider.tsx
    api.writeTmpFile({
      path: `${DIR_NAME}/Provider.tsx`,
      content: tmpFiles.providerContent,
    });

    api.writeTmpFile({
      path: `${DIR_NAME}/runtime.tsx`,
      content: utils.Mustache.render(
        readFileSync(join(__dirname, 'runtime.tsx.tpl'), 'utf-8'),
        {},
      ),
    });
  });
}
