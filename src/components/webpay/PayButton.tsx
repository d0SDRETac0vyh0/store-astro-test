// src/components/PayButton.tsx
import React from 'react';

interface PayButtonProps {
  amount: number;
}

const PayButton: React.FC<PayButtonProps> = ({ amount }) => {
  const handlePayment = async () => {
    try {
      const response = await fetch('/api/webpay/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount, // Usa el monto recibido como prop
          sessionId: 'session123', // ID de la sesión del usuario
          buyOrder: `order-${Date.now()}`, // Número de orden único
          returnUrl: 'https://www.bocchitherock.cloud/thank-you', // URL de confirmación
        }),
      });

      const data = await response.json();

      if (data.token && data.url) {
        const form = document.createElement('form');
        form.method = 'post';
        form.action = data.url;

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'token_ws';
        input.value = data.token;

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
      } else {
        alert('Error al iniciar el pago');
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Ocurrió un error al procesar el pago');
    }
  };

  return (
<button
      onClick={handlePayment}
      className="bg-fuchsia-600 text-white p-3 mt-4 rounded-xl hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2"
    >
      Pagar con WEBPAY
    </button>
  );
};

export default PayButton;
