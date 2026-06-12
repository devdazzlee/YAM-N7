/** Parse weight text (product name, weight label, etc.) into grams. */
export function getWeightInGramsFromText(weightText?: string): number | undefined {
  if (!weightText) return undefined;

  const normalized = weightText.replace(/\s+/g, ' ').trim();

  let match = normalized.match(
    /(\d+(?:\.\d+)?)\s*(kg|kgs|kilogram|kilograms|g|gm|gram|grams|gms)\b/i,
  );

  if (!match) {
    match = normalized.match(/\.(\d+(?:\.\d+)?)\s*(g|gm|gram|grams|gms|kg|kgs)\b/i);
  }

  if (!match) return undefined;

  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  if (Number.isNaN(value) || value <= 0) return undefined;

  if (['kg', 'kgs', 'kilogram', 'kilograms'].includes(unit)) {
    return value * 1000;
  }
  return value;
}

export function formatGramsLabel(grams: number, unitName?: string): string {
  const unit = unitName?.toLowerCase().trim() ?? '';
  if (['kg', 'kgs', 'kilogram', 'kilograms'].includes(unit)) {
    const kg = grams / 1000;
    return kg >= 1 && Number.isInteger(kg) ? `${kg} Kg` : `${kg.toFixed(2).replace(/\.?0+$/, '')} Kg`;
  }
  if (grams >= 1000) {
    const kg = grams / 1000;
    return kg >= 1 ? `${kg} Kg` : `${grams} gms`;
  }
  return Number.isInteger(grams) ? `${grams} gms` : `${grams.toFixed(1)} gms`;
}
