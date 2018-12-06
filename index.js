// Based on a CSV this generate a schema similar to
// - headers are inferred from the source document
// - input is assumed to be CSV
// - output is assumed to be CSV
// - number of rows should be the same as the source input
// - header is always returned


// Background:
// When working with AWS ML models it's useful to have mock data that has
// the same structure as the "Schema source" during the datasource+model
// generation. the


// Related:
// - http://convertcsv.com/generate-test-data.htm
// - https://www.generatedata.com/
// - https://github.com/BurntSushi/xsv (`xsv stats`)

const faker = require('faker');
const fs = require('fs');
const process = require('process');
const stochastic = require('@jwalsh/stochastic');

let args = process.argv.slice(2);
let file = args[0];

let schema = {
    "version" : "1.0",
    "rowId" : null,
    "rowWeight" : null,
    "targetAttributeName" : "y",
    "dataFormat" : "CSV",
    "dataFileContainsHeader" : true,
    "attributes" : [],
    "excludedAttributeNames" : [ ]
};

let header = '';
let rows = fs
    .readFileSync(file)
    .toString()
    .split('\n')
    .map((e, i, c) => {
      if (i === 0) {
          let h = e.split(',');
          h.map(e => {
              schema.attributes.push({
                  "attributeName" : e,
                  "attributeType" : "CATEGORICAL" // NUMERIC, BINARY
              });
          });
          h.splice(2,1);
          header = h.join(',');

      } else {
        if (e === '') {
          return;
        }
          let f = e.split(',');
          return f.join(','); // noop
      }
    });

console.log(rows.length);

console.log(JSON.stringify(schema, null, '  '));
