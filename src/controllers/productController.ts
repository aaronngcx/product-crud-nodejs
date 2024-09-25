import { NextFunction, Request, Response } from 'express';
import { Product } from '../models/product';
import logger from '../core/logger';

const productController = {
  index: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let size: number = Number(req.query.size);
      if (Number.isNaN(size) || size <= 0) {
        size = 10;
      } else if (size > 100) {
        size = 100;
      }

      let page: number = Number(req.query.page);
      if (Number.isNaN(page) || page <= 0) {
        page = 1;
      }

      const sortField: string = req.query.sort?.toString() || 'id';
      const sortDirection: 'ASC' | 'DESC' =
        req.query.dir?.toString().toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      const result = await Product.findAndCountAll({
        offset: (page - 1) * size,
        limit: size,
        order: [[sortField, sortDirection]],
      });

      const totalCount = result.count;
      const totalPages = Math.ceil(totalCount / size);
      const message = req.session.message || '';
      req.session.message = undefined;

      res.render('pages/product/index', {
        products: result.rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          pageSize: size,
        },
        message,
      });
    } catch (err) {
      logger.error(JSON.stringify(err));
      res.render('pages/product/index', {
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          pageSize: 10,
        },
        message: 'Failed to retrieve records.',
      });
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.render('pages/product/create', {
        title: 'Create New Product',
        message: '',
      });
    } catch (error) {
      console.error(error);
      res.status(500).render('pages/product/error', {
        message: 'An error occurred while loading the create page.',
      });
    }
  },

  store: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, name, category, brand, type, description } = req.body;
      if (!code || !name || !category) {
        return res.render('pages/product/create', {
          title: 'Create New Product',
          message: 'Please fill in all required fields.',
        });
      }

      const newProduct = {
        code,
        name,
        category,
        brand,
        type,
        description,
      };

      await Product.create(newProduct);

      req.session.message = {
        type: 'success',
        text: 'Product created successfully!',
      };
      res.redirect('/product');
    } catch (error) {
      console.error(error);
      res.render('pages/product/create', {
        title: 'Create New Product',
        message:
          'An error occurred while creating the product. Please try again.',
      });
    }
  },

  show: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productCode = req.params.code;
      const product = await Product.findOne({ where: { code: productCode } });

      if (!product) {
        req.session.message = {
          type: 'error',
          text: 'Product not found.',
        };
        return res.redirect('/product');
      }

      req.session.message = {
        type: 'success',
        text: 'Product updated successfully!',
      };
      const message = req.session.message || '';
      req.session.message = undefined;

      return res.render('pages/product/show', {
        product,
        message,
      });
    } catch (err) {
      logger.error(JSON.stringify(err));
      res.render('pages/product/error', {
        message: 'Failed to retrieve product details.',
      });
    }
  },

  edit: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productCode = req.params.code;
      const product = await Product.findOne({ where: { code: productCode } });
      if (!product) {
        req.session.message = {
          type: 'error',
          text: 'Product not found.',
        };
        return res.redirect('/product');
      }

      res.render('pages/product/edit', {
        product,
        message: req.session.message || null,
      });
    } catch (err) {
      logger.error(JSON.stringify(err));
      res.render('pages/product/error', {
        message: 'Failed to retrieve product for editing.',
      });
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productCode = req.params.code;
      const { code, name, category, brand, type, description } = req.body;
      const product = await Product.findOne({ where: { code: productCode } });

      if (!product) {
        req.session.message = {
          type: 'error',
          text: 'Product not found.',
        };
        return res.redirect('/product');
      }

      await product.update({
        code,
        name,
        category,
        brand,
        type,
        description,
      });

      req.session.message = {
        type: 'success',
        text: 'Product updated successfully!',
      };

      return res.redirect(`/product/${productCode}`);
    } catch (err) {
      logger.error(JSON.stringify(err));
      res.render('pages/product/error', {
        message: 'Failed to update product.',
      });
    }
  },

  destroy: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productCode = req.params.code;
      const product = await Product.findOne({ where: { code: productCode } });
      if (!product) {
        req.session.message = {
          type: 'error',
          text: 'Product not found.',
        };
        return res.redirect('/product');
      }

      await product.destroy();

      req.session.message = {
        type: 'success',
        text: 'Product deleted successfully!',
      };

      return res.redirect('/product');
    } catch (err) {
      logger.error(JSON.stringify(err));
      res.render('pages/product/error', {
        message: 'Failed to delete product.',
      });
    }
  },
};

export default productController;
