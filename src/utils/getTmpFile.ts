import { genImports, genModels } from '.';
import getProviderContent from './getProviderContent';

function getModelName(name: string) {
  return name.split('.').reverse()?.[1] || name;
}

function getModels(files: string[], absSrcPath: string) {
  const models = genModels(files, absSrcPath);
  return models
    .map(
      (ele) =>
        `'${getModelName(ele.namespace.replace(/'/g, "\\'"))}': ${
          ele.importName
        }`,
    )
    .join(', ');
}

function getModelsType(files: string[], absSrcPath: string) {
  const models = genModels(files, absSrcPath);
  return models
    .map(
      (ele) =>
        `'${getModelName(ele.namespace.replace(/'/g, "\\'"))}': typeof ${
          ele.importName
        }`,
    )
    .join(', ');
}

export const getTmpFile = (files: string[], absSrcPath: string) => {
  const imports = genImports(files);
  const userModels = getModels(files, absSrcPath);
  const typeofUserModels = getModelsType(files, absSrcPath);

  return {
    providerContent: getProviderContent(imports, userModels, typeofUserModels),
  };
};
