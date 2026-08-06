export const allToolsUiCss = String.raw`
/* UX-003F: propagate the validated Pickkit tool language across every public tool. */
:where(
  .tool-shell,
  .prompt-tool-shell,
  .batch-cache-shell,
  .image-cost-shell,
  .speech-cost-shell,
  .rag-cost-shell,
  .fine-tuning-shell,
  .agent-cost-shell,
  .provider-budget-shell,
  .credit-runway-shell,
  .composite-cost-shell,
  .direct-comparison-shell,
  .scenario-shell,
  .budget-capacity-shell,
  .models-shell,
  .selector-shell,
  .compare-shell
) {
  color: var(--color-text-primary);
}

:where(
  .tool-shell,
  .prompt-tool-shell,
  .batch-cache-shell,
  .image-cost-shell,
  .speech-cost-shell,
  .rag-cost-shell,
  .fine-tuning-shell,
  .agent-cost-shell,
  .provider-budget-shell,
  .credit-runway-shell,
  .composite-cost-shell,
  .direct-comparison-shell,
  .scenario-shell,
  .budget-capacity-shell
) :where(.tool-heading, .page-heading, .calculator-intro, .selector-heading, .compare-heading) {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
  align-items: end;
  gap: var(--space-8);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-border-strong);
}

:where(.tool-heading, .page-heading, .selector-heading, .compare-heading) :where(h1, h2) {
  max-width: 780px;
  margin: 0;
  color: var(--color-text-primary);
  font-size: clamp(2rem, 4vw, 3.4rem);
  font-weight: 560;
  line-height: 1.08;
  letter-spacing: -0.045em;
}

:where(.tool-heading, .page-heading, .selector-heading, .compare-heading) > p:last-child {
  max-width: 480px;
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.65;
}

:where(
  .tool-workbench,
  .calculator-grid,
  .selector-workbench,
  .comparison-workbench,
  .cost-workbench,
  .analysis-workbench
) {
  gap: 0;
  margin-top: var(--space-6);
  overflow: hidden;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-panel);
  background: var(--color-surface);
}

:where(
  .tool-workbench,
  .calculator-grid,
  .selector-workbench,
  .comparison-workbench,
  .cost-workbench,
  .analysis-workbench
) > :where(form, aside, section) {
  min-width: 0;
}

:where(.tool-workbench, .comparison-workbench, .cost-workbench, .analysis-workbench) > :where(form, section):first-child {
  border-right: 1px solid var(--color-border-strong);
}

:where(
  .result-panel,
  .selector-result,
  .prompt-token-panel,
  .compare-tray,
  .result-card,
  .summary-panel,
  .cost-summary,
  .recommendation-panel
) {
  position: relative;
  min-width: 0;
  background: var(--color-inverse-surface);
  color: var(--color-on-inverse);
}

:where(
  .result-panel,
  .selector-result,
  .prompt-token-panel,
  .result-card,
  .summary-panel,
  .cost-summary,
  .recommendation-panel
)::before {
  position: absolute;
  inset: 0 0 auto;
  height: 2px;
  background: var(--color-accent);
  content: "";
}

:where(.headline-result, .primary-result, .total-cost, .monthly-cost) :where(strong, output) {
  font-family: var(--font-geist-mono), monospace;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.045em;
}

:where(.result-actions, .export-actions, .share-actions, .scenario-actions) {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-top: var(--space-5);
  border-top: 1px solid var(--color-border-subtle);
}

:where(.result-actions, .export-actions, .share-actions, .scenario-actions) :where(button, a):first-child {
  border-color: var(--color-accent);
  background: var(--color-accent);
  color: var(--color-accent-contrast);
}

:where(table, .comparison-table, .pricing-table, .result-table) {
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}

:where(table, .comparison-table, .pricing-table, .result-table) :where(th, td) {
  border-bottom: 1px solid var(--color-border-subtle);
  color: var(--color-text-secondary);
  text-align: left;
  vertical-align: top;
}

:where(table, .comparison-table, .pricing-table, .result-table) th {
  color: var(--color-text-primary);
  font-size: var(--font-label-size);
  font-weight: 680;
}

:where(.table-scroll, .comparison-table-wrap, .pricing-table-wrap, .result-table-wrap) {
  max-width: 100%;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-gutter: stable;
}

:where(.source-note, .method-note, .catalog-note, .data-source-note) {
  color: var(--color-text-tertiary);
  font-size: 0.875rem;
  line-height: 1.6;
}

:where(.source-note, .method-note, .catalog-note, .data-source-note) a {
  color: var(--color-text-secondary);
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

:where(.empty-state, .error-state, .loading-state) {
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-panel);
  background: var(--color-surface-recessed);
  color: var(--color-text-secondary);
}

@media (max-width: 900px) {
  :where(
    .tool-shell,
    .prompt-tool-shell,
    .batch-cache-shell,
    .image-cost-shell,
    .speech-cost-shell,
    .rag-cost-shell,
    .fine-tuning-shell,
    .agent-cost-shell,
    .provider-budget-shell,
    .credit-runway-shell,
    .composite-cost-shell,
    .direct-comparison-shell,
    .scenario-shell,
    .budget-capacity-shell
  ) :where(.tool-heading, .page-heading, .calculator-intro, .selector-heading, .compare-heading) {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-4);
  }

  :where(.tool-workbench, .calculator-grid, .selector-workbench, .comparison-workbench, .cost-workbench, .analysis-workbench) {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
  }

  :where(.tool-workbench, .comparison-workbench, .cost-workbench, .analysis-workbench) > :where(form, section):first-child {
    border-right: 0;
    border-bottom: 1px solid var(--color-border-strong);
  }
}

@media (max-width: 720px) {
  :where(.tool-heading, .page-heading, .selector-heading, .compare-heading) :where(h1, h2) {
    font-size: clamp(2rem, 10vw, 2.75rem);
  }

  :where(.tool-workbench, .calculator-grid, .selector-workbench, .comparison-workbench, .cost-workbench, .analysis-workbench) {
    margin-inline: calc(var(--space-2) * -1);
  }

  :where(.result-actions, .export-actions, .share-actions, .scenario-actions) > * {
    flex: 1 1 100%;
    min-width: 0;
  }

  :where(table, .comparison-table, .pricing-table, .result-table) {
    min-width: 640px;
  }
}

@media (prefers-reduced-motion: reduce) {
  :where(.tool-shell, .prompt-tool-shell, .result-panel, .result-card, .summary-panel) * {
    scroll-behavior: auto;
  }
}
`;
