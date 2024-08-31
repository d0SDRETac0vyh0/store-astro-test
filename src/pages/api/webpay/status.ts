// src/pages/api/webpay/status.ts

import type { APIRoute } from 'astro';

import WebpayPlus from 'transbank-sdk';
import Transaction from 'transbank-sdk';

const {Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes} = Transaction;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { token } = await request.json();

    const tx = new WebpayPlus.WebpayPlus.Transaction(
      new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration)
    );
    
    const response = await tx.status(token);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener el estado de la transacción.' }), {
      status: 500,
    });
  }
};