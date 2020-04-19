import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import FileController from './app/controllers/FileController'
import DeliverymanController from './app/controllers/DeliverymanController'
import RecipientController from './app/controllers/RecipientController'
import OrderController from './app/controllers/OrderController'
import OrderStartController from './app/controllers/OrderStartControler'
import OrderEndController from './app/controllers/OrderEndController'
import OrdersPendingController from './app/controllers/OrdersPendingController'
import OrdersDeliveredController from './app/controllers/OrdersDeliveredController'
import OrderFindDeliverymanController from './app/controllers/OrderFindDeliverymanController'
import OrderFindRecipientsController from './app/controllers/OrderFindRecipientsController'
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController'
import RecipientFindCPFController from './app/controllers/RecipientFindCPFController'

import authMiddleware from './app/middlewares/auth'

const routes = new Router()
const upload = multer(multerConfig)

/*
Session Routes
*/
routes.post('/sessions', SessionController.store)

/*
 File upload routes
*/
routes.post('/files', upload.single('file'), FileController.store)

/*
 User Rotes
*/
routes.post('/users', UserController.store)
routes.put('/users', authMiddleware, UserController.update)

/*
 Delivery Routes
*/
routes.get('/deliveryman', DeliverymanController.index)
routes.get('/deliveryman/:id', DeliverymanController.show)
routes.post('/deliveryman', authMiddleware, DeliverymanController.store)
routes.put('/deliveryman/:id', authMiddleware, DeliverymanController.update)
routes.delete('/deliveryman/:id', authMiddleware, DeliverymanController.delete)

/*
 Recipient routes
*/
routes.get('/recipients', RecipientController.index)
routes.get('/recipients/:id', RecipientController.show)
routes.get('/recipientsfindcpf/:cpf/', RecipientFindCPFController.show)
routes.post('/recipients', authMiddleware, RecipientController.store)
routes.put('/recipients/:id', authMiddleware, RecipientController.update)
routes.delete('/recipients/:id', authMiddleware, RecipientController.delete)

/*
 Order routes
*/
routes.get('/orders', OrderController.index)
routes.get('/orders/:id', OrderController.show)
routes.post('/orders', authMiddleware, OrderController.store)
routes.put('/orders/:id', authMiddleware, OrderController.update)
routes.delete('/orders/:id', authMiddleware, OrderController.delete)

/*
 OrderFindDeliverymanController routes
*/
routes.get('/orderfind/:id/deliveryman', OrderFindDeliverymanController.show)

/*
 OrderFindRecipientsController routes
*/
routes.get('/orderfind/:id/recipients', OrderFindRecipientsController.show)

/*
 Start order routes
*/
routes.put('/orderstart/:id', OrderStartController.update)

/*
 End order routes
*/
routes.put('/orderend/:id', OrderEndController.update)

/*
List of pending deliveries
*/
routes.get('/deliveryman/:id/pending', OrdersPendingController.index)

/*
List delivered deliveries
*/
routes.get('/deliveryman/:id/delivered', OrdersDeliveredController.index)

/*
 Delivery Problems
*/

routes.get('/delivery/problems', DeliveryProblemsController.index)
routes.get('/delivery/:delivery_id/problems', DeliveryProblemsController.show)
routes.post('/delivery/:delivery_id/problems', DeliveryProblemsController.store)
routes.delete(
  '/delivery/:id/cancel-delivery',
  DeliveryProblemsController.delete
)

export default routes
