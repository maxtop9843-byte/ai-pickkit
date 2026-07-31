export const motionUiCss = String.raw`
:where(.result-panel,.selector-result,.prompt-token-panel,.compare-tray,.result-card){transition:border-color 180ms ease,background-color 180ms ease,box-shadow 180ms ease}
:where(.headline-result>strong,.mini-metrics dd,.saving-box strong,.model-total strong){display:inline-block;transform-origin:left center;animation:result-value-in 220ms ease-out both}
:where(.comparison-row,.result-row,.model-row,.catalog-row){transition:background-color 160ms ease,border-color 160ms ease,transform 160ms ease}
:where(.comparison-row,.result-row,.model-row,.catalog-row):focus-within{border-color:var(--color-border-strong)}
:where(.comparison-row,.result-row,.model-row,.catalog-row):hover{transform:translateY(-1px)}
:where(details)>summary{transition:color 160ms ease,background-color 160ms ease}
:where(details[open])>summary{color:var(--color-text-primary)}
:where(.status-chip,.badge,[data-status]){transition:border-color 160ms ease,background-color 160ms ease,color 160ms ease,opacity 160ms ease}
:where([aria-live="polite"],[role="status"]){animation:status-feedback-in 180ms ease-out both}

@keyframes result-value-in{from{opacity:.35;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
@keyframes status-feedback-in{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}

@media (prefers-reduced-motion:reduce){:where(.headline-result>strong,.mini-metrics dd,.saving-box strong,.model-total strong,[aria-live="polite"],[role="status"]){animation:none}:where(.comparison-row,.result-row,.model-row,.catalog-row){transform:none!important;transition:none}}
`;
