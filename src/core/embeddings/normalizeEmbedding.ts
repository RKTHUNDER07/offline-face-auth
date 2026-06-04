export function normalizeEmbedding(embedding: ArrayLike<number>) {
  let sum = 0;

  for (let i = 0; i < embedding.length; i++) {
    sum += embedding[i] * embedding[i];
  }

  const magnitude = Math.sqrt(sum);

  return Array.from(embedding, value => value / magnitude);
}
