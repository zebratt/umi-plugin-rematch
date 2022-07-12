import { readFileSync } from 'fs';
import { EOL } from 'os';
import path from 'path';
import { winPath } from 'umi/plugin-utils';

export type ModelItem =
  | { absPath: string; namespace: string; exportName?: string }
  | string;

const getFileName = (name: string) => {
  const fileName = path.basename(name, path.extname(name));
  if (fileName.endsWith('.model') || fileName.endsWith('.models')) {
    return fileName.split('.').slice(0, -1).join('.');
  }
  return fileName;
};

export const getName = (absPath: string, absSrcPath: string) => {
  const relativePath = path.relative(absSrcPath, absPath);
  // model files with namespace
  const dirList = path.dirname(relativePath).split(path.sep);
  try {
    const validDirs = dirList.filter(
      (ele) => !['src', 'page', 'pages', 'model', 'models'].includes(ele),
    );
    if (validDirs && validDirs.length) {
      return `${validDirs.join('.')}.${getFileName(relativePath)}`;
    }
    return getFileName(relativePath);
  } catch (e) {
    return getFileName(relativePath);
  }
};

export const getPath = (absPath: string) => {
  const info = path.parse(absPath);
  return winPath(path.join(info.dir, info.name).replace(/'/, "'"));
};

export const genImports = (imports: string[]) =>
  imports
    .map(
      (ele, index) => `import model${index} from "${winPath(getPath(ele))}";`,
    )
    .join(EOL);

export const genModels = (imports: string[], absSrcPath: string) => {
  const contents = imports.map((absPath) => ({
    namespace: getName(absPath, absSrcPath),
    content: readFileSync(absPath).toString(),
  }));

  const checkDuplicates = (list: string[]) =>
    new Set(list).size !== list.length;

  const models = contents.map((ele, index) => {
    return { namespace: ele.namespace, importName: `model${index}` };
  });

  if (checkDuplicates(contents.map((ele) => ele.namespace))) {
    throw Error('umi: models 中包含重复的 namespace！');
  }
  return models;
};
