import path from 'path';
import { EOL } from 'os';
import { readFileSync } from 'fs';
import { utils } from 'umi';

const { t, parser, traverse, winPath } = utils;
export type ModelItem =
  | { absPath: string; namespace: string; exportName?: string }
  | string;

const getFileName = (name: string) => {
  const fileName = path.basename(name, path.extname(name));
  if (fileName.endsWith('.model') || fileName.endsWith('.models')) {
    return fileName
      .split('.')
      .slice(0, -1)
      .join('.');
  }
  return fileName;
};

export const getName = (absPath: string, absSrcPath: string) => {
  const relativePath = path.relative(absSrcPath, absPath);
  // model files with namespace
  const dirList = path.dirname(relativePath).split(path.sep);
  try {
    const validDirs = dirList.filter(
      ele => !['src', 'page', 'pages', 'model', 'models'].includes(ele),
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

export const genExtraModels = (models: ModelItem[] = [], absSrcPath: string) =>
  models.map(ele => {
    if (typeof ele === 'string') {
      return {
        importPath: getPath(ele),
        importName: path.basename(ele).split('.')[0],
        namespace: getName(ele, absSrcPath),
      };
    }
    return {
      importPath: getPath(ele.absPath),
      importName: path.basename(ele.absPath).split('.')[0],
      namespace: ele.namespace,
      exportName: ele.exportName,
    };
  });

type HookItem = { namespace: string; use: string[] };

export const sort = (ns: HookItem[]) => {
  let final: string[] = [];
  ns.forEach((item, index) => {
    if (item.use && item.use.length) {
      const itemGroup = [...item.use, item.namespace];

      const cannotUse = [item.namespace];
      for (let i = 0; i <= index; i += 1) {
        if (ns[i].use.filter(v => cannotUse.includes(v)).length) {
          if (!cannotUse.includes(ns[i].namespace)) {
            cannotUse.push(ns[i].namespace);
            i = -1;
          }
        }
      }

      const errorList = item.use.filter(v => cannotUse.includes(v));
      if (errorList.length) {
        throw Error(
          `Circular dependencies: ${item.namespace} can't use ${errorList.join(
            ', ',
          )}`,
        );
      }

      const intersection = final.filter(v => itemGroup.includes(v));
      if (intersection.length) {
        // first intersection
        const finalIndex = final.indexOf(intersection[0]);
        // replace with groupItem
        final = final
          .slice(0, finalIndex)
          .concat(itemGroup)
          .concat(final.slice(finalIndex + 1));
      } else {
        final.push(...itemGroup);
      }
    }
    if (!final.includes(item.namespace)) {
      // first occurance append to the end
      final.push(item.namespace);
    }
  });

  return [...new Set(final)];
};

export const genModels = (imports: string[], absSrcPath: string) => {
  const contents = imports.map(absPath => ({
    namespace: getName(absPath, absSrcPath),
    content: readFileSync(absPath).toString(),
  }));
  const allUserModel = imports.map(absPath => getName(absPath, absSrcPath));

  const checkDuplicates = (list: string[]) =>
    new Set(list).size !== list.length;

  const raw = contents.map((ele, index) => {
    const ast = parser.parse(ele.content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    const use: string[] = [];

    traverse.default(ast, {
      enter(astPath) {
        if (astPath.isIdentifier({ name: 'useModel' })) {
          try {
            // string literal
            const ns = (astPath.parentPath.node as any).arguments[0].value;
            if (allUserModel.includes(ns)) {
              use.push(ns);
            }
          } catch (e) {
            // console.log(e)
          }
        }
      },
    });

    return { namespace: ele.namespace, use, importName: `model${index}` };
  });

  const models = sort(raw);

  if (checkDuplicates(contents.map(ele => ele.namespace))) {
    throw Error('umi: models 中包含重复的 namespace！');
  }
  return raw.sort(
    (a, b) => models.indexOf(a.namespace) - models.indexOf(b.namespace),
  );
};

export const getValidFiles = (files: string[], modelsDir: string) =>
  files
    .map(file => {
      return path.join(modelsDir, file);
    })
    .filter(ele => !!ele) as string[];
