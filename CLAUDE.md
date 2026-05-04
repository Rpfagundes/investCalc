# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**investCalc** is a static PWA (Progressive Web App) — a Brazilian-Portuguese financial calculator with two tabs: investment growth and loan amortization. No build step, no package manager, no framework.

## Running Locally

Open `index.html` directly in a browser, or serve with a local static server to test PWA features (service worker, manifest):

```bash
python3 -m http.server 8080
# or
npx serve .
```

## Architecture

All logic lives in `calc.js` as two independent vanilla JS classes:

- **`CalculadoraInvestimentos`** — compound interest with monthly contributions. Computes:
  - `montanteIdeal`: final balance after working years (standard compound growth formula)
  - `montanteApoc`: balance after a post-retirement drawdown period, using an adjusted rate `percMens2` that accounts for `valorComido` (monthly consumption from capital)
  - `trabDia`: daily earnings in USD, with a hardcoded branch for the "Claudia" checkbox (subtracts R$5k from the target income, representing a partner's income contribution)
  - Monthly influence table: shows what % of the portfolio each new monthly deposit represents over time

- **`CalculadoraEmprestimo`** — two loan types:
  - **Price**: fixed installments (French amortization). Supports extra monthly amortization with full payoff evolution table.
  - **Bullet**: interest-only payments during term, principal repaid at end. Supports monthly or annual payment frequency.

Both classes follow the same pattern: `initializeElements()` → `addEventListeners()` → `calcular()` → update DOM. All inputs trigger `calcular()` on every `input` event (live recalculation, no submit button).

## Key Financial Formulas

```
// Monthly rate from annual
percMens = (1 + percAnual/100)^(1/12) - 1

// Compound growth with contributions
montante = P * (1+r)^n + PMT * ((1+r)^n - 1) / r

// Price installment (PMT)
parcela = PV * (i * (1+i)^n) / ((1+i)^n - 1)

// Adjusted rate after drawdown
percMens2 = percMens * (1 - valorComido / (montanteIdeal * percMens))
```

## UI Structure

`index.html` is fully static — no templating. Tab switching is handled by toggling `display` on `.tab-content` divs. The loan type toggle (`Price`/`Bullet`) additionally shows/hides field groups (`#campos-price`, `#campos-bullet`) and result panels (`#results-price`, `#results-bullet`).

Currency formatting uses `toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })`. The "Trabalho por Dia" output is formatted as USD despite being a BRL-denominated calculation.
