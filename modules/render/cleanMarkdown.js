export function cleanMarkdown(text) {
  if (!text) return "";

  return text
    // [1, 2, 3] → убрать
    .replace(/\[\d+(,\s*\d+)*\]/g, "")

    // [1] https://url → убрать номер
    .replace(/\[\d+\]\s*/g, "")

    // чистые reference строки [1]
    .replace(/^\[\d+\]\s*$/gm, "")

    // множественные пробелы
    .replace(/\n{3,}/g, "\n\n")

    .trim();
}
