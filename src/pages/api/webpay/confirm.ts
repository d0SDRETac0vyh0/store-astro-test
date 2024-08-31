// src/pages/api/webpay/confirm.ts
import type { APIRoute } from 'astro';

import WebpayPlus from 'transbank-sdk';
import Transaction from 'transbank-sdk';

const { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = Transaction;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { token } = await request.json();

    const tx = new WebpayPlus.WebpayPlus.Transaction(
      new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration)
    );
    
    const response = await tx.commit(token);

    if (response.response_code === 0 && response.status === 'AUTHORIZED') {
      return new Response(JSON.stringify({
        message: 'Transacción exitosa',
        details: response,
        pathname: '/thank-you',
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } else {
      return new Response(JSON.stringify({ error: 'La transacción no fue exitosa.' }), {
        status: 400,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al confirmar la transacción.' }), {
      status: 500,
    });
  }
};