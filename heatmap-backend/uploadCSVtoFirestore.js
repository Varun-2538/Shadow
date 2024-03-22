const fs = require('fs');
const csv = require('csv-parser');
const admin = require('firebase-admin');

const serviceAccount = require('E:\\ksp\\Gallants-KSP\\heatmap-backend\\ksp69-35ef6-firebase-adminsdk-4zdsi-1138b43198.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

fs.createReadStream('E:\\ksp\\Gallants-KSP\\heatmap-backend\\updated_ml_model_ready_dataset.csv')
  .pipe(csv())
  .on('data', (row) => {
    db.collection('dataset').add(row)
      .then((docRef) => {
        console.log(`Document written with ID: ${docRef.id}`);
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });
