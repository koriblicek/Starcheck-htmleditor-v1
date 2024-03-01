import { APP_NAME, EnumUiTemplates, IAppInputData } from './types/index.ts';
import { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import { isInstance } from './utils/index.ts';
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
  const dfii = rootElement.getAttribute("data-form-item-id");
  const dut = rootElement.getAttribute("data-ui-template");
  const dlos = (rootElement.getAttribute("data-load-on-start") === "true");
  if ((dal !== null) && (di !== null) && (dm !== null) && (dv !== null) && (dcl !== null) && (dfii !== null) && (dut !== null) && (dlos !== null)) {
    inputData = {
      dataApiLink: dal,
      dataCssLink: dcl,
      dataFormItemId: dfii,
      dataId: di,
      dataModule: dm,
      dataVersion: dv,
      dataLoadOnStart: dlos,
      dataUiTemplate: isInstance(dut, EnumUiTemplates) as boolean ? dut as EnumUiTemplates : EnumUiTemplates.DEVELOPER_CONDENSED
    };
    console.log(inputData);
    //load css into head
    const head = document.head;
    const link = document.createElement("link");
    link.setAttribute("type", "text/css");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", dcl);
    head.appendChild(link);
  } else {
    // error = true;
    errorMessage = `Some of required input data are missing! 'data-id'='${di}','data-module'='${dm}','data-version'='${dv}','data-css-link'='${dcl}','data-ui-template'='${dut}','data-load-on-start'='${dlos}','data-form-item-id'='${dfii}'`;
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
