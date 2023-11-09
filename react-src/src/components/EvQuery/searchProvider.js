import config from '../../config'; //=
import axios from 'axios';
import csvtojson from 'csvtojson';
import { events, os } from '@neutralinojs/lib';
const searchProviders = config.searchProviders;
//const provider = 'Everything';

function csvFirstLineToLower(csv) {
  const firstLine = csv.match(/^(.*)$/m)[0];
  return csv.replace(/^(.*)$/m, firstLine.toLowerCase().replace(/\s/g, '_'));
}

async function doQuery(provider, searchTerm, filter) {
  switch (provider) {
    case 'Everything':
      const { esExePath } = searchProviders[provider];
      let filterProps = '';

      switch (filter) {
        case 1:
          filterProps = '';
          break;
        case 2:
          filterProps = 'ext:exe;lnk';

          break;
        case 3:
          filterProps = '-ad';

        default:
          break;
      }
      // -sort-run-count-descending
      console.log(`${esExePath} -r "${searchTerm}" ${filterProps} -csv -dm -n 15 -sort-date-modified-descending  -run-count -attrib -name -path-column`);
      
      let getFileList = await os.spawnProcess(
        `${esExePath} -r "${searchTerm}" ${filterProps} -csv -dm -n 15 -sort-date-modified-descending  -run-count -attrib -name -path-column `
      );

      return new Promise((resolve, reject) => {
        let payload = '';
        const eventHandler = async evt => {
          if (getFileList.id === evt.detail.id) {
            switch (evt.detail.action) {
              case 'stdOut':
                payload += evt.detail.data ? evt.detail.data : '';
                break;
              case 'stdErr':
                console.error(evt.detail.data);
                break;
              case 'exit':
                events.off('spawnedProcess', eventHandler);
                //     if (!payload || payload.trim().length === 0) break;
                payload = csvFirstLineToLower(payload);
                const newFileList = await csvtojson().fromString(payload);
                newFileList.sort((a, b) => b.run_count - a.run_count); //put run_count first

                resolve(newFileList);
                break;
            }
          }
        };

        events.on('spawnedProcess', eventHandler);
      });

      break;

    default:
      break;
  }
}

async function doQuery2(provider, searchTerm) {
  let result;
  switch (provider) {
    case 'Everything':
      const { httpEndpoint, httpParams } = searchProviders[provider];
      const result = await axios.get(
        `${httpEndpoint}?search=${searchTerm}&${httpParams}`
      );
      return result.data.results;
      break;

    default:
      break;
  }
}

export default doQuery;
