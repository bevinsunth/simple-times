import { Client, Account } from "appwrite";

export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67133069002afaf3d43d"); // Replace with your project ID

export const account = new Account(client);
export { ID } from "appwrite";

// src/lib/server/appwrite.js
// "use server";
// import { Client, Account } from "node-appwrite";
// import { cookies } from "next/headers";

// export async function createSessionClient() {
//   const client = new Client()
//     .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
//     .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

//   const session = cookies().get("my-custom-session");
//   if (!session || !session.value) {
//     throw new Error("No session");
//   }

//   client.setSession(session.value);

//   return {
//     get account() {
//       return new Account(client);
//     },
//   };
// }

// export async function createAdminClient() {
//   const client = new Client()
//     .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
//     .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)
//     .setKey(process.env.NEXT_APPWRITE_KEY);

//   return {
//     get account() {
//       return new Account(client);
//     },
//   };
// }
