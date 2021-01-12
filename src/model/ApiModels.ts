// contains type definitions and type guards for JSON responses received from the API

export type ApiComment = {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}

/**
 * Type guard for **ApiComment** which checks whether the object has all required properties and whether they're of the expected type
 * @param candidate object to be checked for conformance
 */
export const isApiComment = (candidate: unknown): candidate is ApiComment => {
    if (typeof candidate !== "object" || candidate === null) return false;
    if (!candidate.hasOwnProperty("postId")) return false;
    if (!candidate.hasOwnProperty("id")) return false;
    if (!candidate.hasOwnProperty("name")) return false;
    if (!candidate.hasOwnProperty("email")) return false;
    if (!candidate.hasOwnProperty("body")) return false;
    const candidateDict = candidate as { postId: unknown, id: unknown, name: unknown, email: unknown, body: unknown };
    if (typeof candidateDict.postId !== "number" || candidateDict.postId == null) return false;
    if (typeof candidateDict.id !== "number" || candidateDict.id == null) return false;
    if (typeof candidateDict.name !== "string" || candidateDict.name == null) return false;
    if (typeof candidateDict.email !== "string" || candidateDict.email == null) return false;
    if (typeof candidateDict.body !== "string" || candidateDict.body == null) return false;
    return true;
}

export type ApiUser = {
    id: number;
    name: string;
}

/**
 * Type guard for **ApiUser** which checks whether the object has all required properties and whether they're of the expected type.
 * We check only for properties which are later used by us i.e. it's not an exhaustive check.
 * @param candidate object to be checked for conformance
 */
export const isApiUser = (candidate: unknown): candidate is ApiUser => {
    if (typeof candidate !== "object" || candidate === null) return false;
    if (!candidate.hasOwnProperty("id")) return false;
    if (!candidate.hasOwnProperty("name")) return false;
    const candidateDict = candidate as { id: unknown, name: unknown };
    if (typeof candidateDict.id !== "number" || candidateDict.id == null) return false;
    if (typeof candidateDict.name !== "string" || candidateDict.name == null) return false;
    return true;
}

export type ApiPost = {
    userId: number;
    id: number;
    title: string;
    body: string;
}

/**
 * Type guard for **ApiPost** which checks whether the object has all required properties and whether they're of the expected type
 * @param candidate object to be checked for conformance
 */
export const isApiPost = (candidate: unknown): candidate is ApiPost => {
    if (typeof candidate !== "object" || candidate === null) return false;
    if (!candidate.hasOwnProperty("userId")) return false;
    if (!candidate.hasOwnProperty("id")) return false;
    if (!candidate.hasOwnProperty("title")) return false;
    if (!candidate.hasOwnProperty("body")) return false;
    const candidateDict = candidate as { userId: unknown, id: unknown, title: unknown, body: unknown };
    if (typeof candidateDict.userId !== "number" || candidateDict.userId == null) return false;
    if (typeof candidateDict.id !== "number" || candidateDict.id == null) return false;
    if (typeof candidateDict.title !== "string" || candidateDict.title == null) return false;
    if (typeof candidateDict.body !== "string" || candidateDict.body == null) return false;
    return true;
}