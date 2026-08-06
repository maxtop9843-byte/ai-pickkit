export const toolUiCss = String.raw`
:where(.input-panel,.result-panel,.selector-form,.selector-result,.savings-workbench,.prompt-token-panel,.compare-tray,.tool-card,.result-card){border:1px solid var(--color-border-subtle);border-radius:var(--radius-panel);background:var(--color-surface);color:var(--color-text-primary);box-shadow:none}
:where(.input-panel,.selector-form,.savings-workbench){background:var(--color-surface)}
:where(.result-panel,.selector-result,.compare-tray,.prompt-token-panel){background:var(--color-inverse-surface);color:var(--color-on-inverse);border-color:var(--color-inverse-border)}
:where(input:not([type="checkbox"]):not([type="radio"]),select,textarea,.number-control){min-height:44px;border:1px solid var(--color-border-subtle);border-radius:var(--radius-control);background:var(--color-surface-recessed);color:var(--color-text-primary);box-shadow:inset 0 1px 0 color-mix(in srgb,var(--color-text-primary) 4%,transparent);transition:border-color 160ms ease,background-color 160ms ease,box-shadow 160ms ease}
:where(input,select,textarea)::placeholder{color:var(--color-text-tertiary);opacity:1}
:where(input,select,textarea):hover{border-color:var(--color-border-strong)}
:where(input,select,textarea):focus-visible,:where(button,a,summary,[tabindex]):focus-visible{outline:3px solid color-mix(in srgb,var(--focus-ring) 72%,transparent);outline-offset:2px}
:where(button,.button,.hero-link,.header-cta,.compare-pick,.preset){min-height:40px;border-radius:var(--radius-control);font-weight:680;transition:border-color 160ms ease,background-color 160ms ease,color 160ms ease,transform 120ms ease}
:where(button,.button,.hero-link,.header-cta,.compare-pick,.preset):active:not(:disabled){transform:translateY(1px)}
:where(button,.button,.compare-pick,.preset):disabled{opacity:.48;cursor:not-allowed}
:where(.preset,.provider-tabs button,.compare-pick,.theme-control-option){border:1px solid var(--color-border-subtle);background:var(--color-surface);color:var(--color-text-secondary);box-shadow:none}
:where(.preset.active,.provider-tabs button.active,.compare-pick[aria-pressed="true"]){border-color:color-mix(in srgb,var(--color-accent) 58%,var(--color-border-strong));background:color-mix(in srgb,var(--color-accent) 11%,var(--color-surface));color:var(--color-text-primary);box-shadow:inset 3px 0 var(--color-accent)}
:where(.numeric-field>span:first-child,.input-panel legend,.selector-fieldset legend){color:var(--color-text-primary);font-size:var(--font-label-size);font-weight:680}
:where(.numeric-field small,.field-help,.helper-text,.catalog-note,.model-price span){color:var(--color-text-tertiary)}
:where(.result-panel,.selector-result,.compare-tray,.prompt-token-panel) :where(p,small,span){color:var(--color-on-inverse-muted)}
:where(.result-panel,.selector-result,.compare-tray,.prompt-token-panel) :where(h2,h3,strong,b){color:var(--color-on-inverse)}
:where(.result-panel,.selector-result,.compare-tray,.prompt-token-panel) :where(input,select,textarea,.number-control){background:var(--color-surface-recessed);color:var(--color-text-primary)}
:where(.catalog-row,.result-row,.comparison-row,.prompt-volume-fields label){border-color:var(--color-border-subtle)}
:where(.catalog-row,.result-row,.comparison-row){transition:background-color 150ms ease}
:where(.catalog-row,.result-row,.comparison-row):hover{background:color-mix(in srgb,var(--color-text-primary) 3%,var(--color-surface))}
:where(.catalog-row.selected,.result-row.selected,.comparison-row.selected){background:color-mix(in srgb,var(--color-accent) 9%,var(--color-surface))}
:where(.capability-tags span,.status-chip,.badge){border:1px solid var(--color-border-subtle);border-radius:6px;background:var(--color-surface-raised);color:var(--color-text-secondary)}
:where(.error-message,[role="alert"]){color:var(--color-danger)}
:where(.success-message,[data-status="success"]){color:var(--color-success)}
:where(.warning-message,[data-status="warning"]){color:var(--color-warning)}

/* UX-003C representative calculator pilot: one continuous decision workbench. */
.calculator-shell{scroll-margin-top:var(--space-8)}
.calculator-shell .calculator-intro{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(260px,.75fr);align-items:end;gap:var(--space-8);padding-bottom:var(--space-6);border-bottom:1px solid var(--color-border-strong)}
.calculator-shell .calculator-intro h2{max-width:720px;margin:0;color:var(--color-text-primary);font-size:clamp(2rem,4vw,3.5rem);font-weight:560;line-height:1.08;letter-spacing:-.045em}
.calculator-shell .calculator-intro>p:last-child{max-width:430px;margin:0;color:var(--color-text-secondary);line-height:1.65}
.calculator-shell .calculator-grid{align-items:stretch;gap:0;margin-top:var(--space-6);border:1px solid var(--color-border-strong);border-radius:var(--radius-panel);overflow:hidden;background:var(--color-surface)}
.calculator-shell .input-panel,.calculator-shell .result-panel{border:0;border-radius:0}
.calculator-shell .input-panel{border-right:1px solid var(--color-border-strong)}
.calculator-shell .input-panel fieldset+fieldset{padding-top:var(--space-6);border-top:1px solid var(--color-border-subtle)}
.calculator-shell .input-panel legend{letter-spacing:-.015em}
.calculator-shell .input-panel legend>span{font-family:var(--font-geist-mono),monospace;color:var(--color-accent);font-size:.75rem;letter-spacing:.08em}
.calculator-shell .preset-grid{gap:var(--space-2)}
.calculator-shell .preset{min-height:76px;text-align:left}
.calculator-shell .preset strong{font-size:.92rem}
.calculator-shell .preset span{line-height:1.45}
.calculator-shell .result-panel{position:relative;background:var(--color-inverse-surface);color:var(--color-on-inverse)}
.calculator-shell .result-panel:before{position:absolute;top:0;right:0;left:0;height:2px;background:var(--color-accent);content:""}
.calculator-shell .result-heading{padding-bottom:var(--space-4);border-bottom:1px solid var(--color-inverse-border)}
.calculator-shell .headline-result{padding:var(--space-7) 0}
.calculator-shell .headline-result>strong{font-family:var(--font-geist-mono),monospace;font-size:clamp(2.6rem,5vw,4.4rem);font-weight:520;line-height:1;letter-spacing:-.065em;font-variant-numeric:tabular-nums}
.calculator-shell .mini-metrics{border-top:1px solid var(--color-inverse-border);border-bottom:1px solid var(--color-inverse-border)}
.calculator-shell .mini-metrics>div+div{border-left:1px solid var(--color-inverse-border)}
.calculator-shell .mini-metrics dd,.calculator-shell .saving-box strong,.calculator-shell .model-total strong{font-family:var(--font-geist-mono),monospace;font-variant-numeric:tabular-nums}
.calculator-shell .saving-box{border:0;border-radius:var(--radius-control);background:transparent}
.calculator-shell .result-actions{padding-top:var(--space-5);border-top:1px solid var(--color-inverse-border)}
.calculator-shell .result-actions button:first-child{border-color:var(--color-accent);background:var(--color-accent);color:var(--color-accent-contrast)}
.calculator-shell .comparison{margin-top:var(--space-7);border-top:1px solid var(--color-border-strong)}
.calculator-shell .model-row{border-color:var(--color-border-subtle)}
.calculator-shell .model-row.recommended{background:color-mix(in srgb,var(--color-accent) 7%,var(--color-surface))}

@media (max-width:900px){.calculator-shell .calculator-intro{grid-template-columns:minmax(0,1fr);gap:var(--space-4)}.calculator-shell .calculator-intro>p:last-child{max-width:680px}.calculator-shell .calculator-grid{display:grid;grid-template-columns:minmax(0,1fr)}.calculator-shell .input-panel{border-right:0;border-bottom:1px solid var(--color-border-strong)}}
@media (max-width:720px){:where(button,.button,.hero-link,.header-cta,.compare-pick,.preset){min-height:44px}:where(.input-panel,.result-panel,.selector-form,.selector-result,.savings-workbench){padding-inline:var(--space-5)}:where(.field-grid,.advanced-fields,.model-selects){grid-template-columns:minmax(0,1fr)}:where(input,select,textarea,.number-control){width:100%;min-width:0}.calculator-shell .calculator-intro{padding-bottom:var(--space-5)}.calculator-shell .calculator-intro h2{font-size:clamp(2rem,10vw,2.75rem)}.calculator-shell .calculator-grid{margin-inline:calc(var(--space-2) * -1)}.calculator-shell .preset{min-height:72px}.calculator-shell .headline-result>strong{font-size:clamp(2.5rem,14vw,3.6rem)}.calculator-shell .mini-metrics{grid-template-columns:minmax(0,1fr)}.calculator-shell .mini-metrics>div+div{border-left:0;border-top:1px solid var(--color-border-subtle)}}
@media (prefers-reduced-motion:reduce){:where(input,select,textarea,button,.button,.hero-link,.header-cta,.compare-pick,.preset,.catalog-row,.result-row,.comparison-row){transition:none}}
`;
