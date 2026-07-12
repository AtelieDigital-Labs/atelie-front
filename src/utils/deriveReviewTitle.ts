export function deriveReviewTitle(comment: string, maxLength = 50): string {
  // pega a primeira frase (até . ! ou ?)
  const firstSentenceMatch = comment.match(/^[^.!?]+[.!?]?/)
  const firstSentence = firstSentenceMatch ? firstSentenceMatch[0].trim() : comment.trim()

  if (firstSentence.length <= maxLength) return firstSentence

  return firstSentence.slice(0, maxLength).trim() + '...'
}