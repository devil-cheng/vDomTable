// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from 'D:/umiReact/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "exact": true,
    "component": require('@/pages/index.js').default
  },
  {
    "path": "/table copy",
    "exact": true,
    "component": require('@/pages/table copy.js').default
  },
  {
    "path": "/table",
    "exact": true,
    "component": require('@/pages/table.js').default
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
