import express from 'express'
import { protectUser } from '../../middleware/protectUser.js'
import { initializePayment, handlePaystackWebhook } from '../../controllers/payment/fluxa-pro-controller.js';

const paymentRouter = express.Router();


paymentRouter.post("/fluxa-pro", protectUser, initializePayment);
paymentRouter.post("/webhooks/paystack", handlePaystackWebhook);


export default paymentRouter;