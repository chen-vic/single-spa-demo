import React from "react";
import ReactDOM from "react-dom";
import RouterConfig from "./router";
import singleSpaReact from 'single-spa-react';
import "./index.css";

// ReactDOM.render(
//   <React.StrictMode>
//     <RouterConfig />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

const rootComponent = () => {
  return (
    <React.StrictMode>
      <RouterConfig />
    </React.StrictMode>
  );
}

// 子应用独立运行
if (!window.singleSpaNavigate) {
  ReactDOM.render(rootComponent(), document.getElementById("root"));
}

// https://single-spa.js.org/docs/ecosystem-react/
const reactLifecycles = singleSpaReact({
  el: document.getElementById("reactDOM"),
  React,
  ReactDOM,
  rootComponent,
  errorBoundary(err, info, props) {
    // https://reactjs.org/docs/error-boundaries.html
    return <div>This renders when a catastrophic error occurs</div>;
  },
});

export const bootstrap = async props => {
  return reactLifecycles.bootstrap(props);
}

export const mount = async (props) => {
  console.log("react===>", props);
  return reactLifecycles.mount(props);
};

export const unmount = async (props) => {
  return reactLifecycles.unmount(props);
};
