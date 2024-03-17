import * as AWS from "@aws-sdk/client-lambda";

const client = new AWS.Lambda({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
  },
});

const params = {
  FunctionName: "convertVideo",
  InvocationType: "RequestResponse",
  Payload: JSON.stringify({
    inputBase64: "value1",
  }),
};

try {
  const data = await client.invoke(params).then();
  const result = Buffer.from(data.Payload).toString();
  console.log(result);
} catch (error) {
  console.log({ error });
}
