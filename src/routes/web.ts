import express from 'express';
import homeController from '../controllers/homeController';
import productController from '../controllers/productController';

const router = express.Router();

router.get('/', homeController.homePage);

router.get('/product', productController.index);
router.get('/product/create', productController.create);
router.post('/product', productController.store);
router.get('/product/:code', productController.show);
router.get('/product/:code/edit', productController.edit);
router.post('/product/:code', productController.update);
router.post('/product/:code/delete', productController.destroy);

export default router;
