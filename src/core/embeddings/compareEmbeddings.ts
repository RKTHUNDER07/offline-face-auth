export function compareEmbeddings(embeddingA: number[], embeddingB: number[]) {
  let dotProduct = 0;

  let normA = 0;

  let normB = 0;

  for (let i = 0; i < embeddingA.length; i++) {
    dotProduct += embeddingA[i] * embeddingB[i];

    normA += embeddingA[i] * embeddingA[i];

    normB += embeddingB[i] * embeddingB[i];
  }

  normA = Math.sqrt(normA);

  normB = Math.sqrt(normB);

  return dotProduct / (normA * normB);
}
