import { Client, Account } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67133069002afaf3d43d'); // Replace with your project ID

export const account = new Account(client);
export { ID } from 'appwrite';
