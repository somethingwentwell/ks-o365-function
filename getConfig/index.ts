import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import got from 'got';
const { TableClient, AzureSASCredential, odata } = require("@azure/data-tables");

interface Config {
    csvpath: string;
    email: string[];
    daysTodisable?: number;
    daysToDelete?: number;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

        // const {data} = await got.post('https://httpbin.org/anything', {
        //     json: {
        //         hello: 'world'
        //     }
        // }).json();

        // console.log(data);

        const account = "kaishingstor";
        const sas = "?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2021-12-31T13:05:18Z&st=2021-11-29T05:05:18Z&spr=https,http&sig=ai5Ujtd9sw92%2FYxil4N2ZrLFQjh7CN6g5wGCWt57wPU%3D";
        const credential = new AzureSASCredential(sas);
        const tableName = "config";
        const client = new TableClient(`https://${account}.table.core.windows.net`, tableName, credential);
        const resData:Config = {csvpath:"", email:[]};

        //GET CSV Path
        let partitionKey = "csvpath";
        let entitiesIter = client.listEntities({
            queryOptions: {
              filter: odata`PartitionKey eq ${partitionKey}`
            }
          }
        );
        for await (const entity of entitiesIter) {
          resData.csvpath = entity.value;
        }

        //GET Emails
        partitionKey = "email";
        entitiesIter = client.listEntities({
            queryOptions: {
              filter: odata`PartitionKey eq ${partitionKey}`
            }
          }
        );
        for await (const entity of entitiesIter) {
          resData.email.push(entity.value);
        }

        //GET daysTodisable
        partitionKey = "daysTodisable";
        entitiesIter = client.listEntities({
            queryOptions: {
              filter: odata`PartitionKey eq ${partitionKey}`
            }
          }
        );
        for await (const entity of entitiesIter) {
            resData.daysTodisable = entity.value;
        }

        //GET daysTodisable
        partitionKey = "daysToDelete";
        entitiesIter = client.listEntities({
            queryOptions: {
              filter: odata`PartitionKey eq ${partitionKey}`
            }
          }
        );
        for await (const entity of entitiesIter) {
            resData.daysToDelete = entity.value;
        }


    context.res = {
        // status: 200, /* Defaults to 200 */
        body: resData
    };

};

export default httpTrigger;