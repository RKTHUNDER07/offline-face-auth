import {compareEmbeddings} from '../embeddings/compareEmbeddings';
import {getRegistration} from '../storage/getRegistration';
import {normalizeEmbedding} from '../embeddings/normalizeEmbedding';

export async function runEmbeddingAuth(liveEmbedding: number[]) {
  const registration = await getRegistration('demo-user');

  if (!registration) {
    return {
      success: false,
      score: 0,
      reason: 'NO_REGISTRATION',
    };
  }

  let bestScore = 0;

  const normalizedLiveEmbedding = normalizeEmbedding(liveEmbedding);

  for (const storedEmbedding of registration.embeddings) {
    const similarity = compareEmbeddings(
      normalizedLiveEmbedding,
      storedEmbedding,
    );

    if (similarity > bestScore) {
      bestScore = similarity;
    }
  }

  return {
    success: bestScore > 0.75,
    score: bestScore,
  };
}
