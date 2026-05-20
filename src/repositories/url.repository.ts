import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const documentClient = DynamoDBDocumentClient.from(client);

export class UrlRepository {
  async getById(id: string) {
    const response = await documentClient.send(
      new GetCommand({
        TableName: process.env.TABLE_NAME,

        Key: {
          id,
        },
      }),
    );

    return response.Item;
  }
}
