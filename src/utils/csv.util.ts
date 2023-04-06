const csv = require('fast-csv');
import fs from 'fs';

// input: a .csv file path and a filter function, output: data of .csv read by stream
export async function readCsvFile(
  filePath: string,
  filterCondition: (row: any) => boolean = () => true,
) {
  return new Promise((resolve, reject) => {
    let fileContent = [];
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on('data', (row: any) => {
        if (filterCondition(row)) {
          fileContent.push(row);
        }
      })
      .on('end', () => {
        resolve(fileContent);
      })
      .on('error', (error: unknown) => {
        reject(error);
      });
  });
}
