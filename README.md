# NINE · private poker

Private Texas Hold'em tables for 9 seats, with play chips. Create a table, share the link, play.

- `engine.js`: the game rules (blinds, betting, side pots, hand ranking). The table host's browser runs it.
- `index.html`: lobby and live table. Players connect through Supabase Realtime; each player's cards travel encrypted only to them (ECDH + AES-GCM).
- `node test.js`: engine tests (2,400 simulated hands, chips are conserved).
