# SIXTH · Poker

Texas Hold'em rooms with 9 seats: private tables, a public table finder, Sit & Go tournaments, six rooms unlocked by level, and a profile with photo, level and play coins.

- `index.html`: landing page.
- `app.html` + `game.js`: the game (lobby, tournaments, profile, table).
- `engine.js`: the game rules (blinds, betting, side pots, hand ranking, tournaments). The table host's browser runs it.
- Live play runs over Supabase Realtime; each player's cards travel encrypted only to them (ECDH + AES-GCM).
- `node test.js`: engine tests.
- `REQUISITOS.md`: what it takes to play for real crypto money (license, server-side dealing, certified RNG, KYC, custody).

Play coins only. They have no cash value.
