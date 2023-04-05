const csv = require('fast-csv');
import fs from 'fs';

export async function readCsvFile(filePath: string) {
  return new Promise((resolve, reject) => {
    let fileContent = [];
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on('data', row => {
        fileContent.push(row);
      })
      .on('end', () => {
        resolve(fileContent);
      })
      .on('error', error => {
        reject(error);
      });
  });
}
