import React from 'react';
import { RematchProvider } from '.'

export function dataflowProvider(container: React.ReactNode) {
  return React.createElement(RematchProvider, null, container);
}
