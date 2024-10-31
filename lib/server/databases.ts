"use server"

import { createDatabasesClient } from "@/lib/server/appwrite";

const databaseId = process.env.NEXT_APPWRITE_DATABASE_ID || "";
const collectionId = process.env.NEXT_APPWRITE_COLLECTION_ID || "";



export async function createDocument(documentId: string, data: any, permissions: string[] = []) {

    const { databases } = await createDatabasesClient();
    return databases.createDocument(databaseId, collectionId, documentId, data, permissions);
    
    }