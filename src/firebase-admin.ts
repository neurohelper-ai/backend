import * as admin from 'firebase-admin';
import * as fs from 'fs';

admin.initializeApp({
  credential: admin.credential.cert(
    fs.readFileSync('./assets/key.json').toString(),
  ),
});
