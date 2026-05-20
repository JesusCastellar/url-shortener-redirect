import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { RedirectService } from "../services/redirect.service";

const service = new RedirectService();

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.codigo;

    if (!id) {
      return {
        statusCode: 400,

        body: JSON.stringify({
          message: "Código requerido",
        }),
      };
    }

    const url = await service.getOriginalUrl(id);

    return {
      statusCode: 302,

      headers: {
        Location: url,
      },

      body: "",
    };
  } catch (error) {
    return {
      statusCode: 404,

      body: JSON.stringify({
        message: "URL no encontrada",
      }),
    };
  }
};
