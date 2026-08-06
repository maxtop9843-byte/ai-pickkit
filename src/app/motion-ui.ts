export const motionUiCss = String.raw`
:where(.result-panel,.selector-result,.prompt-token-panel,.compare-tray,.result-card){transition:border-color 180ms ease,background-color 180ms ease,box-shadow 180ms ease}
:where(.headline-result>strong,.mini-metrics dd,.saving-box strong,.model-total strong){display:inline-block;transform-origin:left center;animation:result-value-in 220ms ease-out both}
:where(.comparison-row,.result-row,.model-row,.catalog-row){transition:background-color 160ms ease,border-color 160ms ease,transform var(--duration-base,220ms) var(--ease-spring,ease)}
:where(.comparison-row,.result-row,.model-row,.catalog-row):focus-within{border-color:var(--color-border-strong)}
:where(.comparison-row,.result-row,.model-row,.catalog-row):hover{transform:translateY(-1px)}
:where(details)>summary{transition:color 160ms ease,background-color 160ms ease}
:where(details[open])>summary{color:var(--color-text-primary)}
:where(.status-chip,.badge,[data-status]){transition:border-color 160ms ease,background-color 160ms ease,color 160ms ease,opacity 160ms ease}
:where([aria-live="polite"],[role="status"]){animation:status-feedback-in 180ms ease-out both}

/* Card / link lift on hover-hover devices only, so touch taps don't get stuck mid-animation. */
@media (hover: hover) and (pointer: fine) {
  :where(.home-tool-link,.tool-directory-link,.preset,.selector-choice,.prompt-model-options button){
    transition:transform var(--duration-base,220ms) var(--ease-spring,ease),box-shadow var(--duration-base,220ms) var(--ease-spring,ease),border-color 160ms ease,background-color 160ms ease;
  }
  :where(.home-tool-link,.tool-directory-link):hover{
    transform:translateY(-3px);
    box-shadow:var(--shadow-md,0 12px 32px rgba(24,54,42,.1));
  }
  :where(.home-tool-link,.tool-directory-link):hover .home-tool-arrow{transform:translateX(3px)}
  .home-tool-arrow{display:inline-block;transition:transform 200ms var(--ease-spring,ease)}
  :where(.preset,.selector-choice):hover{transform:translateY(-2px)}
  :where(.hero-link,.header-cta,.home-secondary-link,.result-actions button):hover{transform:translateY(-2px);box-shadow:var(--shadow-md,0 12px 32px rgba(24,54,42,.1))}
}
:where(.hero-link,.header-cta,.home-secondary-link,.result-actions button){transition:transform var(--duration-fast,140ms) var(--ease-spring,ease),box-shadow var(--duration-fast,140ms) var(--ease-spring,ease),background-color 160ms ease,border-color 160ms ease,color 160ms ease}

/* Scroll reveal: driven by layout.tsx's IntersectionObserver adding .is-revealed to section shells. */
:where(
  .calculator-shell,.compare-shell,.selector-shell,.prompt-estimator-shell,.savings-shell,
  .home-tool-directory,.prompt-tool-band,.explain-section,.tools-directory .tool-group,
  .tool-shell,.prompt-tool-shell,.batch-cache-shell,.image-cost-shell,.speech-cost-shell,
  .rag-cost-shell,.fine-tuning-shell,.agent-cost-shell,.provider-budget-shell,
  .credit-runway-shell,.composite-cost-shell,.direct-comparison-shell,.scenario-shell,
  .budget-capacity-shell,.models-shell
){
  opacity:0;
  transform:translateY(18px);
  transition:opacity var(--duration-slow,420ms) var(--ease-spring,ease),transform var(--duration-slow,420ms) var(--ease-spring,ease);
}
:where(
  .calculator-shell,.compare-shell,.selector-shell,.prompt-estimator-shell,.savings-shell,
  .home-tool-directory,.prompt-tool-band,.explain-section,.tools-directory .tool-group,
  .tool-shell,.prompt-tool-shell,.batch-cache-shell,.image-cost-shell,.speech-cost-shell,
  .rag-cost-shell,.fine-tuning-shell,.agent-cost-shell,.provider-budget-shell,
  .credit-runway-shell,.composite-cost-shell,.direct-comparison-shell,.scenario-shell,
  .budget-capacity-shell,.models-shell
).is-revealed{
  opacity:1;
  transform:none;
}
/* A short stagger for the first rows of each grid once its shell has revealed. */
.is-revealed .home-tool-grid>*,.is-revealed .tool-group-list>*,.is-revealed .explain-grid>*{
  animation:result-value-in 480ms var(--ease-spring,ease) both;
}
.is-revealed .home-tool-grid>:nth-child(2),.is-revealed .tool-group-list>:nth-child(2),.is-revealed .explain-grid>:nth-child(2){animation-delay:40ms}
.is-revealed .home-tool-grid>:nth-child(3),.is-revealed .tool-group-list>:nth-child(3),.is-revealed .explain-grid>:nth-child(3){animation-delay:80ms}
.is-revealed .home-tool-grid>:nth-child(4),.is-revealed .tool-group-list>:nth-child(4){animation-delay:120ms}
.is-revealed .home-tool-grid>:nth-child(5),.is-revealed .tool-group-list>:nth-child(5){animation-delay:160ms}
.is-revealed .home-tool-grid>:nth-child(6),.is-revealed .tool-group-list>:nth-child(6){animation-delay:200ms}
.is-revealed .home-tool-grid>:nth-child(7){animation-delay:240ms}

@keyframes result-value-in{from{opacity:.35;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
@keyframes status-feedback-in{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}

@media (prefers-reduced-motion:reduce){
  :where(.headline-result>strong,.mini-metrics dd,.saving-box strong,.model-total strong,[aria-live="polite"],[role="status"]){animation:none}
  :where(.comparison-row,.result-row,.model-row,.catalog-row){transform:none!important;transition:none}
  :where(
    .calculator-shell,.compare-shell,.selector-shell,.prompt-estimator-shell,.savings-shell,
    .home-tool-directory,.prompt-tool-band,.explain-section,.tools-directory .tool-group,
    .tool-shell,.prompt-tool-shell,.batch-cache-shell,.image-cost-shell,.speech-cost-shell,
    .rag-cost-shell,.fine-tuning-shell,.agent-cost-shell,.provider-budget-shell,
    .credit-runway-shell,.composite-cost-shell,.direct-comparison-shell,.scenario-shell,
    .budget-capacity-shell,.models-shell
  ){opacity:1;transform:none;transition:none}
  .is-revealed .home-tool-grid>*,.is-revealed .tool-group-list>*,.is-revealed .explain-grid>*{animation:none}
}
`;
