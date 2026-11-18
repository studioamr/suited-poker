# SUITED by NorthPoint · lanzamiento del MVP

**Link:** https://studioamr.github.io/suited-poker/ (el juego está en `app.html`)

## Cómo funciona el dinero

- **Afuera, dólares; adentro, fichas.** Cada mesa tiene su buy-in en dólares. Ejemplo: Gold cuesta $100 y te da 10,000 fichas. Al pararte, tus fichas se vuelven dólares otra vez.
- **Se paga en USDC** (dólar digital, 1 USDC = $1) desde Phantom, en Solana.
- **Quien abre la mesa es el banco.** Recibe los buy-ins en su wallet y paga los cash-outs y premios con una sola aprobación. No hay wallet de la casa: nadie guarda el dinero de otros.
- **Cada pago se verifica en la cadena** antes de dar asiento o fichas: de quién viene, a qué cuenta llega y cuánto. Un mismo pago no se puede usar dos veces.

## Lo que necesita cada jugador

1. **Phantom** instalado (celular o extensión de Chrome).
2. **USDC en Solana** por el monto del buy-in. Se compra dentro de Phantom o se manda desde un exchange (Bitso, Binance) eligiendo la red Solana.
3. **Un poco de SOL para comisiones:** con unos $2 USD de SOL alcanza para muchas transacciones. El banco necesita un poco más, porque la primera vez que le paga a alguien abre su cuenta de USDC (≈ $0.30).

## Pasos de una noche

1. El anfitrión abre `app.html`, conecta Phantom y elige una mesa (Classic $5 … Double Diamond $25K, o Infinite desde $50K) o crea un torneo (entrada en dólares).
2. Toca **invite** y manda el link.
3. Cada amigo toca un asiento → **pay $X & take seat** → aprueba en Phantom. En cuanto se confirma, queda sentado con sus fichas.
4. **Cash games:** quien se para recibe su cash-out cuando el banco toca **pay cash-outs** (una aprobación para todos).
5. **Torneos:** el banco toca **start tournament** cuando están todos. Al final toca **pay winners** y los premios llegan solos (50/30/20 con 7+ jugadores).

## Riesgos que hay que conocer antes de abrirlo al público

- **El banco tiene que pagar.** Con amigos no hay problema. Con desconocidos, el banco podría no pagar: la página no puede obligarlo, porque el dinero está en su wallet. Para el público abierto, lo seguro es una bóveda con contrato o servidor (ver `REAL-MONEY.md`).
- **El navegador del banco reparte las cartas.** Si cierra la pestaña, la mesa se congela hasta que vuelva. Y en teoría podría ver el mazo.
- **Legal:** ofrecer poker por dinero al público sin licencia es ilegal en México (SEGOB) y en muchos países. Entre amigos, con el banco como uno más, es otra cosa, pero no es asesoría legal.
- **Probado:** el flujo completo (pagar → sentarse → jugar → cash-out / premios) con firmas simuladas, y la transacción de USDC simulada en Solana mainnet sin errores. Falta el primer pago real con Phantom: hazlo con la mesa Classic ($5) antes de jugar fuerte.
