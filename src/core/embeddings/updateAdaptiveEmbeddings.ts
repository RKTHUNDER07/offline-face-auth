import {getRegistration} from '../storage/getRegistration';

import {saveRegistration} from '../storage/saveRegistration';

const TRUST_THRESHOLD = 0.9;

const MAX_EMBEDDINGS = 10;

export async function updateAdaptiveEmbeddings({
  userId,
  authScore,
  newEmbedding,
}: {
  userId: string;

  authScore: number;

  newEmbedding: number[];
}) {
  try {
    /*
      TRUST CHECK
    */

    if (authScore < TRUST_THRESHOLD) {
      return;
    }

    /*
      FETCH USER
    */

    const registration = await getRegistration(userId);

    if (!registration) {
      return;
    }

    /*
      CURRENT BANK
    */

    const embeddingBank = registration.embeddings;

    /*
      APPEND NEW
    */

    embeddingBank.push(newEmbedding);

    /*
      FCFS LIMIT
    */

    if (embeddingBank.length > MAX_EMBEDDINGS) {
      embeddingBank.shift();
    }

    /*
      SAVE UPDATED BANK
    */

    await saveRegistration({
      uid: registration.uid,

      embeddings: embeddingBank,

      registeredAt: registration.registeredAt,
    });

    console.log('EMBEDDING BANK UPDATED:', embeddingBank.length);
  } catch (error) {
    console.log('ADAPTIVE UPDATE ERROR:', error);
  }
}
