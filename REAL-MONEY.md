# SUITED · cómo funciona el dinero real (y qué falta para encenderlo)

## Lo que ya funciona (en Solana devnet, SOL de prueba)

1. **Cada mesa es una tarjeta con precio en SOL** (`pricing.js`): Classic 0.05 · Silver 0.25 · Gold 1 · Platinum 5 · Black 20 · Diamond 75 · Double Diamond 250 SOL. La página muestra el equivalente en dólares y en BTC con precio en vivo.
2. **Sentarte = pagar el buy-in.** Al tocar un asiento sale la ventana de pago; Phantom firma una **transferencia real** del buy-in a la bóveda de la casa, con un memo `suited:<mesa>:seat<n>:<modo>` que identifica qué mesa y qué asiento pagó. La firma queda en tu historial con link a Solscan.
3. **Torneos:** cada entrada pide su tarjeta (starter → Classic, pro → Gold, high roller → Black, major → Double Diamond) y se cobra igual, en SOL. El premio es la suma de entradas menos 5% de la casa, repartido 50/30/20.
4. **Fichas ↔ SOL:** en la mesa todo se muestra en SOL (stack, apuestas, bote, premios). Cada mesa guarda cuánto SOL vale su buy-in.
5. **Cash-out y premios** quedan registrados como *pending settlement* en tu historial, con el monto exacto en SOL.

## Qué falta para mainnet (en este orden)

| # | Pieza | Por qué | Cómo |
|---|---|---|---|
| 1 | **Dirección de la bóveda** | Dónde llegan los buy-ins. | André pone su dirección **pública** en `pricing.js → vault`. Recomendado: multifirma (Squads) para que una sola llave no pueda vaciarla. |
| 2 | **Reparto en servidor** | Hoy el navegador del anfitrión baraja: en teoría podría ver el mazo. Con dinero, eso es fraude posible. | Mover `engine.js` a un servidor (Supabase Edge Function / worker) que baraje, mande a cada jugador solo sus cartas y decida al ganador. Los navegadores solo mandan acciones. |
| 3 | **Liquidación automática** | Pagar al ganador requiere firmar desde la bóveda, y esa llave **nunca** puede estar en la página. | Opción A (rápida): el servidor del punto 2 firma los pagos desde una wallet caliente con límite diario. Opción B (la buena): un programa de Solana (Anchor) por mesa/torneo que guarda los buy-ins en una cuenta del programa y solo libera fondos con el resultado firmado por el servidor de reparto. |
| 4 | **Verificar cada buy-in** | Que nadie se siente diciendo que pagó sin pagar. | El servidor revisa la firma en la cadena (monto, destino y memo) antes de dar el asiento. |
| 5 | **RNG auditado** | Que la baraja sea demostrablemente justa. | Laboratorio independiente (GLI, iTech Labs, BMM) o baraja verificable (commit-reveal). |
| 6 | **Licencia + KYC + bloqueo por país** | Poker por dinero sin licencia es ilegal en México (SEGOB) y en la mayoría de países. | Ver `REQUISITOS.md`. |

## Encender mainnet

Solo cuando los puntos 1–6 estén listos: en `pricing.js` cambiar `network: 'devnet'` → `'mainnet'` y poner `vault`. Nada más en la página cambia: el resto ya habla en SOL.
