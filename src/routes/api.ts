import express from 'express';
import productApiController from '../controllers/productApiController';

const router = express.Router();

router.get('/products', productApiController.listing);
router.get('/products/:code', productApiController.retrieveByCode);
router.post('/products', productApiController.createProduct);
router.put('/products/:code', productApiController.updateProduct);
router.delete('/products/:code', productApiController.deleteProduct);

export default router;
