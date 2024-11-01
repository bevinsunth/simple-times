"use server"

import { createDatabasesClient } from "@/lib/server/appwrite";
    

const db: { [key: string]: any } = {};

export async function getDb() {
  return db;
}

const collections = [{
    databaseId: process.env.NEXT_APPWRITE_DATABASE_ID || "",
    collectionId: process.env.NEXT_APPWRITE_COLLECTION_ID || "",
    name: 'timeEntry'
}]

collections.forEach((col) => {
  db[col.name] = {
    create: async (documentId: string, data: any) => {
      const { databases } = await createDatabasesClient();
      return databases.createDocument(col.databaseId, col.collectionId, documentId, data);
    },
    get: async (documentId: string) => {
      const { databases } = await createDatabasesClient();
      return databases.getDocument(col.databaseId, col.collectionId, documentId);
    },
    update: async (documentId: string, data: any) => {
      const { databases } = await createDatabasesClient();
      return databases.updateDocument(col.databaseId, col.collectionId, documentId, data);
    },
  };
});
