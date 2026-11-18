# OBSIDIAN · qué hace falta para jugar con dinero real en cripto

Hoy OBSIDIAN funciona con **monedas de juego sin valor**. Esto lista lo que hace falta antes de abrir mesas y torneos con USDC/SOL de verdad (entradas de miles de dólares incluidas). Las cifras son rangos orientativos para planear: **confírmalas con un abogado de juego antes de gastar**.

## 1. Lo legal (va primero: sin esto no se abre)

| Pieza | Qué es | Notas |
|---|---|---|
| Licencia de juego en línea | Permiso para ofrecer poker con dinero real | Opciones comunes para cripto: Anjouan, Curaçao (nuevo régimen LOK), Isla de Man, Malta (MGA). Cada una cambia en costo, tiempo y en qué países te deja operar. |
| México | Permiso de la Secretaría de Gobernación (Ley Federal de Juegos y Sorteos) | Sin permiso, ofrecer apuestas a jugadores en México es ilegal. Se suele operar con un permisionario ya existente. |
| Bloqueo por país | Impedir el acceso desde donde no tienes licencia | EE.UU. (salvo estados con licencia propia), Reino Unido, Francia y otros exigen su propia licencia. |
| Empresa | Sociedad en la jurisdicción de la licencia | Con cuenta bancaria y contabilidad separada de los fondos de jugadores. |
| KYC / AML | Verificar identidad y origen de fondos | Proveedores tipo Sumsub o Veriff. Obligatorio con cripto; monitoreo de wallets (Chainalysis, TRM). |
| Juego responsable | Límites de depósito, autoexclusión, solo mayores de 18 | Lo exige toda licencia seria. |

## 2. Lo técnico (cambia cómo está hecho hoy)

1. **El reparto pasa a un servidor.** Hoy la baraja la mezcla el navegador del anfitrión de la mesa: sirve entre amigos, pero el anfitrión podría ver el mazo. Con dinero real, la lógica (`engine.js`) corre en un servidor tuyo y los jugadores solo mandan acciones.
2. **Generador aleatorio certificado (RNG).** Un laboratorio independiente (GLI, iTech Labs, BMM, eCOGRA) audita la mezcla. Opción extra: barajas verificables (commit-reveal) para que el jugador compruebe que no se manipuló.
3. **Custodia del dinero.** Saldos de jugadores en wallets separadas (multifirma) o en un contrato inteligente de escrow por mesa/torneo. Depósitos y retiros en USDC sobre Solana o Base para comisiones bajas.
4. **Anti-trampas.** Detección de colusión (jugadores que se pasan fichas), bots y multicuentas. Revisión de manos sospechosas antes de pagar premios grandes.
5. **Torneos grandes (multimesa).** Hoy solo hay Sit & Go de una mesa. Para torneos de cientos o miles de jugadores: balanceo de mesas, burbuja, re-entradas y horario fijo. Requiere servidor.
6. **Cuentas reales.** Inicio de sesión con correo, Google o wallet; historial de manos guardado; soporte y disputas.

## 3. Cómo gana dinero la sala

- **Rake en mesas de dinero:** se cobra un % de cada bote con tope por mano (lo normal en la industria es entre 2.5% y 5%).
- **Comisión en torneos:** se cobra encima de la entrada (ej. entrada $1,000 + $100 de comisión).
- **Torneos patrocinados y pases** como fuentes de ingreso extra.

## 4. Orden recomendado

1. **Ahora:** crecer con monedas de juego (comunidad, mesas privadas, torneos), medir cuánta gente regresa.
2. **Abogado de juego:** elegir jurisdicción y estructura. Es lo que más tarda (meses).
3. **Servidor + RNG certificado + KYC** mientras sale la licencia.
4. **Abrir dinero real** solo en los países que cubra la licencia, empezando con entradas bajas.

## 5. Lo que ya está hecho

- Motor de Texas Hold'em probado: 2,400 manos simuladas sin crear ni perder fichas, botes laterales, empates, torneos Sit & Go con ciegas crecientes y pagos 50/30/20.
- Mesas privadas de 9, buscador de mesas públicas, 6 salas por nivel, perfil con foto, niveles y monedas.
- Cartas cifradas por jugador (ECDH + AES-GCM).
