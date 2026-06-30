export function normalizeExpression(expr: string): string {
  return expr
    .replace(/x²/g, 'x*x')
    .replace(/÷/g, '/')
    .replace(/×/g, '*')
    .replace(/−/g, '-')
    .replace(/π/g, String(Math.PI))
    .replace(/e(?!\d)/g, String(Math.E))
    .replace(/\^/g, '**')
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/log\(/g, 'Math.log10(')
    .replace(/√\(/g, 'Math.sqrt(');
}

export function evaluateDisplay(display: string): string {
  try {
    const expr = normalizeExpression(display);
    if (expr.includes('=') || expr.includes('x')) return display;
    const result = Function(`"use strict"; return (${expr})`)() as number;
    if (!Number.isFinite(result)) return 'Error';
    return String(Math.round(result * 1e10) / 1e10);
  } catch {
    return 'Error';
  }
}

export function sqrtDisplay(display: string): string {
  try {
    const n = parseFloat(normalizeExpression(display));
    if (!Number.isFinite(n) || n < 0) return 'Error';
    return String(Math.sqrt(n));
  } catch {
    return 'Error';
  }
}
