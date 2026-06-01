  
export async function generateEmbedding(
  imagePath: string,
) {

  // MOCK EMBEDDING

  const embedding =
    Array.from(
      { length: 128 },
      () =>
        Math.random(),
    );

  return embedding;
}

