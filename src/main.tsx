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
      const dfii = dataElement.getAttribute("data-form-item-id")?.split(",");
      const dut = dataElement.getAttribute("data-ui-template")?.split(",");
      if ((dal !== null) && (di !== null) && (dm !== null) && (dv !== null) && (dfii !== undefined) && (dut !== undefined)) {
        inputData = {
          dataApiLink: dal,
          dataFormItemId: dfii[index].trim(),
          dataId: di,
          dataModule: dm,
          dataVersion: dv,
          dataUiTemplate: isInstance(dut[index].trim(), EnumUiTemplates) as boolean ? dut[index].trim() as EnumUiTemplates : EnumUiTemplates.DEVELOPER_CONDENSED
        };
      } else {
        // error = true;
        errorMessage = `Some of required input data are missing! 'data-id'='${di}','data-module'='${dm}','data-version'='${dv}','data-ui-template'='${dut}','data-form-item-id'='${dfii}'`;
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
    const dfii = rootElement.getAttribute("data-form-item-id");
    const dut = rootElement.getAttribute("data-ui-template");
    if ((dal !== null) && (di !== null) && (dm !== null) && (dv !== null) && (dfii !== null) && (dut !== null)) {
      inputData = {
        dataApiLink: dal,
        dataFormItemId: dfii,
        dataId: di,
        dataModule: dm,
        dataVersion: dv,
        dataUiTemplate: isInstance(dut, EnumUiTemplates) as boolean ? dut as EnumUiTemplates : EnumUiTemplates.DEVELOPER_CONDENSED
      };
    } else {
      // error = true;
      errorMessage = `Some of required input data are missing! 'data-id'='${di}','data-module'='${dm}','data-version'='${dv}','data-ui-template'='${dut}','data-form-item-id'='${dfii}'`;
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
