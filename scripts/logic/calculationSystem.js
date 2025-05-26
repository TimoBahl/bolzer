export function calculation(ergebnis, tipp) {
  const { home: eh, away: ea } = ergebnis;
  const { home: th, away: ta } = tipp;

  if (eh === th && ea === ta) return 4;

  const echteDiff = eh - ea;
  const tippDiff = th - ta;

  const richtigerSieger =
    (eh > ea && th > ta) || (eh < ea && th < ta) || (eh === ea && th === ta);

  if (richtigerSieger && echteDiff === tippDiff) return 3;
  if (richtigerSieger && echteDiff !== tippDiff) return 2;
  if (!richtigerSieger && echteDiff === tippDiff) return 1;

  return 0;
}
