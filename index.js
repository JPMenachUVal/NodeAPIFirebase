// index.js
const express = require('express');
const bodyParser = require('body-parser');
const { ref, set, get, update } = require('firebase/database');
const db = require('./firebaseConfig');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Firebase Realtime Database API',
      version: '1.0.0',
      description: 'API to insert data into Firebase Realtime Database'
    }
  },
  apis: ['./index.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /addUser:
 *   post:
 *     summary: Insert a user into Firebase Realtime Database
 *     description: Insert a user into Firebase Realtime Database with default image
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user to create
 *         schema:
 *           type: object
 *           required:
 *             - id_user
 *             - active_status
 *           properties:
 *             id_user:
 *               type: integer
 *             active_status:
 *               type: boolean
 *             avatar:
 *               type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */

app.post('/addUser', (req, res) => {
  const { id_user, active_status, avatar = 'https://firebasestorage.googleapis.com/v0/b/brilliant-era-407902.appspot.com/o/avatars%2F00a8d634116e1179823d8465b168a2c6.jpg?alt=media&token=ae11ef4f-acc2-4551-b6aa-15882de721fc' } = req.body;


  const userRef = ref(db, 'userconfig/' + id_user);
  set(userRef, {
    id_user,
    active_status,
    avatar
  })
  .then(() => res.status(200).send('User created successfully'))
  .catch((error) => res.status(500).send(error.message));
});


/**
 * @swagger
 * /getUserConfig/{id_user}:
 *   get:
 *     summary: Retrieve user configuration from Firebase Realtime Database
 *     description: Retrieve user configuration for a given user ID from Firebase Realtime Database
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User configuration retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

app.get('/getUserConfig/:id_user', (req, res) => {
  const { id_user } = req.params;

  const userRef = ref(db, 'userconfig/' + id_user);
  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        res.status(200).json(snapshot.val());
      } else {
        res.status(404).send('User not found');
      }
    })
    .catch((error) => res.status(500).send(error.message));
});

/**
 * @swagger
 * /updateActiveStatus/{id_user}/{active_status}:
 *   put:
 *     summary: Update active status of a user in Firebase Realtime Database
 *     description: Update the active status of a user (true/false) in Firebase Realtime Database
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *       - in: path
 *         name: active_status
 *         required: true
 *         description: New active status of the user (1 for true, 0 for false)
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 1
 *     responses:
 *       200:
 *         description: User active status updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

app.put('/updateActiveStatus/:id_user/:active_status', (req, res) => {
  const { id_user, active_status } = req.params;
  const newStatus = active_status === '1'; // Convertir a boolean

  const userRef = ref(db, 'userconfig/' + id_user);
  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        update(userRef, { active_status: newStatus })
          .then(() => res.status(200).send('User active status updated successfully'))
          .catch((error) => res.status(500).send(error.message));
      } else {
        res.status(404).send('User not found');
      }
    })
    .catch((error) => res.status(500).send(error.message));
});

/**
 * @swagger
 * /updateAvatar/{id_user}:
 *   put:
 *     summary: Update avatar URL of a user in Firebase Realtime Database
 *     description: Update the avatar URL of a user in Firebase Realtime Database
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *       - in: body
 *         name: avatar
 *         required: true
 *         description: New avatar URL
 *         schema:
 *           type: object
 *           required:
 *             - avatar
 *           properties:
 *             avatar:
 *               type: string
 *     responses:
 *       200:
 *         description: User avatar URL updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
app.put('/updateAvatar/:id_user', (req, res) => {
  const { id_user } = req.params;
  const { avatar } = req.body;

  const userRef = ref(db, 'userconfig/' + id_user);
  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists() && snapshot.val().id_user) {  // Verificar que id_user exista
        update(userRef, { avatar })
          .then(() => res.status(200).send('User avatar URL updated successfully'))
          .catch((error) => res.status(500).send(error.message));
      } else {
        res.status(404).send('User not found');
      }
    })
    .catch((error) => res.status(500).send(error.message));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
