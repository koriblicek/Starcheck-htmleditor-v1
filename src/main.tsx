// import ReactDOM from 'react-dom/client';
// import App from './App.tsx';


// ReactDOM.createRoot(document.getElementById('root')!).render(
//   // <React.StrictMode>
//   <App />
//   // </React.StrictMode>
// );


import { APP_NAME, IAppInputData } from './types/index.ts';
import { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './translations/i18n';
import App from './App.tsx';

//input data
let inputData: IAppInputData | undefined;

//error logs
let errorMessage = "";
// let error = false;

//find root element
const rootElement = document.getElementById(`${APP_NAME}-root`) as HTMLElement;
//if no root found
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  //check for div and loading error
  const dal = "https://www.starcheck.sk/apijs/";
  const di = rootElement.getAttribute("data-id");
  const dm = rootElement.getAttribute("data-module");
  const dv = rootElement.getAttribute("data-version");
  const dcl = rootElement.getAttribute("data-css-link");
  const ddk = rootElement.getAttribute("data-db-key");
  const dral = rootElement.getAttribute("data-rest-api-link");
  const dlos = (rootElement.getAttribute("data-load-on-start") === "true");
  if ((dal !== null) && (di !== null) && (dm !== null) && (dv !== null) && (dcl !== null) && (ddk !== null) && (dlos !== null) && (dral !== null)) {
    inputData = {
      dataApiLink: dal,
      dataCssLink: dcl,
      dataDbKey: ddk,
      dataId: di,
      dataModule: dm,
      dataVersion: dv,
      dataLoadOnStart: dlos,
      dataRestApiLink: dral
    };
    //load css into head
    const head = document.head;
    const link = document.createElement("link");
    link.setAttribute("type", "text/css");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", dcl);
    head.appendChild(link);
  } else {
    // error = true;
    errorMessage = `Some of required input data are missing! 'data-id'='${di}','data-module'='${dm}','data-version'='${dv}','data-css-link'='${dcl}','data-db-key'='${ddk}','data-load-on-start'='${dlos}','data-rest-api-link'='${dral}'`;
    console.error(`(Starcheck-wdesigner): ${errorMessage}`);
  }
  root.render(
    // <React.StrictMode>
    <Fragment>
      {inputData &&
        <App inputData={inputData} />
      }
    </Fragment>

    // </React.StrictMode>
  );
} else {
  // error = true;
  errorMessage = `Root node id '${APP_NAME}-root' not found!`;
  console.error(`(Starcheck-emails): ${errorMessage}`);
}
