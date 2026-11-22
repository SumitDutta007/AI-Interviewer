import { initializeApp, cert } from "firebase-admin/app";
import dotenv from "dotenv";

dotenv.config();

export const app = initializeApp({
  credential: cert({
    "type": "service_account",
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": "0b16a2f788f92e10a0a985e8f3eaf441d2872e3f",
    "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": "111494668637051021070",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40ai-interviewer-1de7d.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }),
});