import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const documentClient = DynamoDBDocumentClient.from(client);

export class VisitRepository {
  async saveVisit(codigo: string) {
    const now = new Date();

    const fecha = now.toISOString().split("T")[0];

    await documentClient.send(
      new PutCommand({
        TableName: process.env.VISITS_TABLE,

        Item: {
          codigo,

          timestamp: now.toISOString(),

          fecha,
        },
      }),
    );
  }
}
