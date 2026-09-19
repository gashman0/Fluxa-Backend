import express from 'express'
import { protectUser } from '../../middleware/protectUser.js'
import { initializePayment } from '../../controllers/payment/fluxa-pro-controller.js';

const paymentRouter = express.Router();


paymentRouter.post("/fluxa-pro", protectUser, initializePayment);


export default paymentRouter;