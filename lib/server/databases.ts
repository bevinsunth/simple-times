"use server"

import { type Models } from "node-appwrite"

import { createDatabasesClient } from "@/lib/server/appwrite"

interface CollectionOperations<T extends Models.Document> {
  query: (queries: string[]) => Promise<Models.DocumentList<T>>
  create: (
    documentId: string,
    data: Omit<T, keyof Models.Document>
  ) => Promise<T>
  get: (documentId: string) => Promise<T>
  update: (
    documentId: string,
    data: Omit<T, keyof Models.Document>
  ) => Promise<T>
}

const collections = {
  timeEntry: {
    databaseId: process.env.NEXT_APPWRITE_DATABASE_ID ?? "",
    collectionId: process.env.NEXT_APPWRITE_TIMEENTRY_COLLECTION_ID ?? "",
  },
} as const

type CollectionNames = keyof typeof collections

function createCollectionOperations<T extends Models.Document>(
  databaseId: string,
  collectionId: string
) {
  return {
    query: async (queries: string[]): Promise<Models.DocumentList<T>> => {
      const { databases } = createDatabasesClient()
      return databases.listDocuments(databaseId, collectionId, queries)
    },
    create: async (
      documentId: string,
      data: Omit<T, keyof Models.Document>
    ): Promise<T> => {
      const { databases } = createDatabasesClient()
      return databases.createDocument(
        databaseId,
        collectionId,
        documentId,
        data
      )
    },
    get: async (documentId: string): Promise<T> => {
      const { databases } = createDatabasesClient()
      return databases.getDocument(databaseId, collectionId, documentId)
    },
    update: async (
      documentId: string,
      data: Omit<T, keyof Models.Document>
    ): Promise<T> => {
      const { databases } = createDatabasesClient()
      return databases.updateDocument(
        databaseId,
        collectionId,
        documentId,
        data
      )
    },
  }
}

export async function GetDbOperations<T extends Models.Document>(
  collectionName: CollectionNames
): Promise<CollectionOperations<T>> {
  const collection =
    collections[collectionName as keyof typeof collections]
  return createCollectionOperations<T>(
    collection.databaseId,
    collection.collectionId
  )
}

// Object.values(collections).forEach((col) => {
//   db[col.collectionId] = createCollectionOperations(col.databaseId, col.collectionId);
// });

// export function getDb<T>(): Record<string, CollectionOperations<any>>{
//   return db;
// }
