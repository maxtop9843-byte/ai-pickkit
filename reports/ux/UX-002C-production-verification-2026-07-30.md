# UX-002C Production Verification Retry

## Scope

This checkpoint retriggers deployment for the already-merged UX-002C accessibility baseline without changing application behavior.

Validation target:

- shared `:focus-visible` outline across public routes
- 44px minimum control height for coarse pointers
- global `prefers-reduced-motion` handling
- homepage and representative calculator HTTP/canonical behavior
- production runtime errors

## Merge gate

- exact-head GitHub CI/checks must succeed
- Vercel Preview should be READY for the exact head when available
- after squash merge, the resulting main SHA must receive a READY Production deployment
- canonical production must be checked before UX-002C is marked DONE

No application code, pricing data, routes, calculations, or visual tokens are changed by this checkpoint.
