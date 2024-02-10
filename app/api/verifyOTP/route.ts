// Assuming you've imported Request and Response from 'next' or another library as needed.
import { db } from '@/utils/firebaseClient'; // Adjust the import path as necessary
import { doc, getDoc, updateDoc } from '@firebase/firestore';
// import { doc, getDoc } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import speakeasy from 'speakeasy';

export async function POST(req: Request, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // Parsing the JSON body from the request
            const data = await req.json();
            const { userId, token } = data;

            // Retrieve the user's document from Firestore
            const userDocRef = doc(db, 'users', userId);
            const docSnap = await getDoc(userDocRef);

            if (!docSnap.exists()) {
                console.log('no exists', userId);
                // Correctly handle the case where the user document does not exist
                return res.status(404).json({ success: false, error: "User not found." });
            }

            const secret = docSnap.data().otpSecret;
            console.log('SECRET', secret);
            const verified = speakeasy.totp.verify({
                secret: secret,
                encoding: 'base32',
                token: token,
            });


            if (verified) {
                // OTP verification successful
                console.log('verifired!');
                // OTP verification successful, enable the user to log in
                await updateDoc(userDocRef, {
                    enabled: true,
                });
                return res.status(200).json({ success: true, message: "OTP verification successful." });
            } else {
                // OTP verification failed
                console.log('no verifired!');
                return res.status(400).json({ success: false, error: "OTP verification failed." });
            }
        } catch (error) {
            console.error('Error during OTP verification:', error);
            return res.status(500).json({ success: false, error: "Internal server error." });
        }
    } else {
        // return res.setHeader('Allow', ['POST']);
        // return res.status(405).end('Method Not Allowed');
    }
    return "hello";
}
