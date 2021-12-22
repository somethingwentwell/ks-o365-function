import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import got from 'got';
const csv=require("csvtojson");

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

        const data = await got('https://kaishingstor.blob.core.windows.net/csv/users.csv');

        let jsonRes = await csv({
            noheader:false
        })
        .fromString(data.body);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: jsonRes
    };

};

export default httpTrigger;