import { APP_NAME, EnumUiTemplates, IAppInputData } from './types/index.ts';
import { Fragment } from 'react';
import { isInstance } from './utils/index.ts';
import ReactDOM from 'react-dom/client';
import './translations/i18n';
import AppDataLoader from './AppDataLoader.tsx';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';

//input data
let inputData: IAppInputData | undefined;

//error logs
let errorMessage = "";
// let error = false;


const editorLocations = document.currentScript?.getAttribute('multiple-divs')?.split(",");

if (editorLocations) {
  const dataElement = document.getElementById(`${APP_NAME}-root`) as HTMLElement;
  editorLocations.forEach((element, index) => {
    const rootElement = document.getElementById(element.trim()) as HTMLElement;
    console.log(element);
    //if no root found
    if (rootElement) {
      const root = ReactDOM.createRoot(rootElement);

      //check for div and loading error
      const dal = "https://www.starcheck.sk/apijs/";
      const di = dataElement.getAttribute("data-id");
      const dm = dataElement.getAttribute("data-module");
      const dv = dataElement.getAttribute("data-version");
      const dcl = dataElement.getAttribute("data-css-link");
      const dfii = dataElement.getAttribute("data-form-item-id")?.split(",");
      const dut = dataElement.getAttribute("data-ui-template")?.split(",");
      const dlos = (dataElement.getAttribute("data-load-on-start") === "true");
      if ((dal !== null) && (di !== null) && (dm !== null) && (dv !== null) && (dcl !== null) && (dfii !== undefined) && (dut !== undefined) && (dlos !== null)) {
        inputData = {
          dataApiLink: dal,
          dataCssLink: dcl,
          dataFormItemId: dfii[index].trim(),
          dataId: di,
          dataModule: dm,
          dataVersion: dv,
          dataLoadOnStart: dlos,
          dataUiTemplate: isInstance(dut[index].trim(), EnumUiTemplates) as boolean ? dut[index].trim() as EnumUiTemplates : EnumUiTemplates.DEVELOPER_CONDENSED
        };
        //load css into head
        const head = document.head;
        const link = document.createElement("link");
        link.setAttribute("type", "text/css");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", dcl);
        link.setAttribute("id", "css-" + dfii);
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
            <Provider store={store}>
              <AppDataLoader inputData={inputData} />
            </Provider>
          }
        </Fragment>

        // </React.StrictMode>
      );
    } else {
      // error = true;
      errorMessage = `Root node id '${APP_NAME}-root' not found!`;
      console.error(`(Starcheck-emails): ${errorMessage}`);
    }
  });
} else {

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
      //load css into head
      const head = document.head;
      const link = document.createElement("link");
      link.setAttribute("type", "text/css");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("href", dcl);
      link.setAttribute("id", "css-" + dfii);
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
          <Provider store={store}>
            <AppDataLoader inputData={inputData} />
          </Provider>
        }
      </Fragment>

      // </React.StrictMode>
    );
  } else {
    // error = true;
    errorMessage = `Root node id '${APP_NAME}-root' not found!`;
    console.error(`(Starcheck-emails): ${errorMessage}`);
  }

}
