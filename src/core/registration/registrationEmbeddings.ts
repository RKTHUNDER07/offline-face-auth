export interface RegistrationEmbeddings { embeddings: number[][]; } 


export function createEmptyEmbeddings(): RegistrationEmbeddings { return { embeddings: [], }; }