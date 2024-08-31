// src/pages/api/webpay/initiate.ts

import type { APIRoute } from 'astro';

// const WebpayPlus = require("transbank-sdk").WebpayPlus; // CommonJS
// import { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from "transbank-sdk"; // CommonJS

import WebpayPlus from 'transbank-sdk';
import Transaction from 'transbank-sdk';

const {Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes} = Transaction;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { buyOrder, sessionId, amount, returnUrl } = await request.json();

    const tx = new WebpayPlus.WebpayPlus.Transaction(
      new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration)
    );
    
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);

    return new Response(JSON.stringify({
      token: response.token,
      url: response.url,
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al crear la transacción.' }), {
      status: 500,
    });
  }
};