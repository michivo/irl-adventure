import { initializeApp, getApps } from 'firebase-admin/app';
import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { randomUUID } from 'node:crypto';
import { tool } from '@openai/agents';
import { z } from 'zod';
import { config } from './config.ts';

export const uploadFileTool = tool({
    name: 'Upload File',
    description:
        'Uploads a local file to Firebase Storage and returns a public download URL',
    parameters: z.object({
        filePath: z.string().describe('Path to the local file to upload'),
        destination: z
            .string()
            .describe(
                'Destination path within the storage bucket, e.g. audio/tour-1.mp3',
            ),
    }),
    async execute({
        filePath,
        destination,
    }: {
        filePath: string;
        destination: string;
    }) {
        return await uploadFileToStorage(filePath, destination);
    },
});

export async function uploadFileToStorage(
    filePath: string,
    destination: string,
) {
    const bucket = getStorageBucket();
    // Firebase's client-usable download URLs are gated behind a per-file access token, not the object's public ACL.
    const downloadToken = randomUUID();

    try {
        const [file] = await bucket.upload(filePath, {
            destination,
            metadata: {
                metadata: { firebaseStorageDownloadTokens: downloadToken },
            },
        });

        const encodedPath = encodeURIComponent(file.name);
        return {
            gsUrl: `gs://${bucket.name}/${file.name}`,
            downloadUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${downloadToken}`,
        };
    } catch (error) {
        console.error('Error during upload:', error);
        throw error;
    }
}

function getStorageBucket() {
    try {
        if (getApps().length === 0) {
            if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
                throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
            }
            initializeApp({
                credential: admin.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
                storageBucket: config.firebaseStorageBucket,
            });
            console.log('Initialized app.');
        }
        return getStorage().bucket();
    }
    catch (error) {
        console.error('Error during upload:', error);
        throw error;
    }
}

export default uploadFileTool;
