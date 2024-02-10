// Assuming you've imported Request and Response from 'next' or another library as needed.
import { db } from '@/utils/firebaseClient'; // Adjust the import path as necessary
import { doc, getDoc, updateDoc } from '@firebase/firestore';
// import { doc, getDoc } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import speakeasy from 'speakeasy';

export async function POST(req: Request, res: Response) {
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
                return new Response(JSON.stringify({ success: false, error: "User not found." }), {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
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
                return new Response(JSON.stringify({ success: true, message: "OTP verification successful." }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                // OTP verification failed
                console.log('no verifired!');
                return new Response(JSON.stringify({ success: false, error: "OTP verification failed." }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
        } catch (error) {
            console.error('Error during OTP verification:', error);
            return new Response(JSON.stringify({ success: false, error: "Internal server error." }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } else {
        // return res.setHeader('Allow', ['POST']);
        // return res.status(405).end('Method Not Allowed');
    }
    return "hello";
}
