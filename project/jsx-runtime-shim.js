// JSX runtime shim — esm.sh transpiles to use react/jsx-runtime.
const React = window.React;
function jsx(type, props, key) {
  const { children, ...rest } = props || {};
  if (key !== undefined) rest.key = key;
  return React.createElement(type, rest, children);
}
function jsxs(type, props, key) {
  const { children, ...rest } = props || {};
  if (key !== undefined) rest.key = key;
  return React.createElement(type, rest, ...(Array.isArray(children) ? children : [children]));
}
const Fragment = React.Fragment;
export { jsx, jsxs, jsx as jsxDEV, Fragment };
