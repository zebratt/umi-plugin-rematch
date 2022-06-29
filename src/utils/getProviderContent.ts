export default function(
  imports: string,
  userModels: string,
  typeofUserModels: string,
) {
  if (!imports) {
    return `import React from 'react';
export default ({ children }: { children: React.ReactNode }) => children
`;
  }
  return `import React from 'react';
import type { Models } from '@rematch/core'
import { init } from '@rematch/core';
import { Provider } from 'react-redux'
import immerPlugin from '@rematch/immer';
import type { RematchDispatch, RematchRootState } from '@rematch/core';
${imports}

export interface RootModel extends Models<RootModel> {${typeofUserModels} };

const models: RootModel = {${userModels}}

export const store = init<RootModel>({
  models,
  plugins: [immerPlugin()]
})

export type RootState = RematchRootState<RootModel>;

export default ({ children }: { children: React.ReactNode }) => {

  return (
    <Provider store={store}>
      <h1>This is provider layer</h1>
      {children}
    </Provider>
  )
}
`;
}
