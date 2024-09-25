import { NextFunction, Request, Response } from 'express';
import logger from '../core/logger';
import { Product } from '../models/product';

const productApiController = {
  listing: (req: Request, res: Response, next: NextFunction): void => {
    logger.info('retrieving product listing');

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

    Product.findAndCountAll({
      offset: (page - 1) * size,
      limit: size,
      order: [[sortField, sortDirection]],
    })
      .then((result) => {
        const totalCount = result.count;
        const totalPages = Math.ceil(totalCount / size);

        res.status(200).json({
          status: true,
          data: result.rows,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            pageSize: size,
          },
        });
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        res.status(422).json({
          status: false,
          message: 'Fail retrieving data!',
          error: err,
        });
      });
  },

  retrieveByCode: (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const productCode: string = req.params.code;

      if (!productCode) {
        res.status(400).json({
          status: false,
          message: 'Product code is required.',
        });
        return resolve();
      }

      Product.findOne({ where: { code: productCode } })
        .then((product) => {
          if (product) {
            res.status(200).json({
              status: true,
              data: product,
            });
          } else {
            res.status(404).json({
              status: false,
              message: 'Product not found.',
            });
          }
          resolve();
        })
        .catch((err) => {
          logger.error(JSON.stringify(err));
          res.status(500).json({
            status: false,
            message: 'Error retrieving product data!',
            error: err,
          });
          reject(err);
        });
    });
  },

  createProduct: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { code, name, category, brand, type, description } = req.body;
    const missingFields: string[] = [];

    if (!code) {
      missingFields.push('code');
    }
    if (!name) {
      missingFields.push('name');
    }
    if (!category) {
      missingFields.push('category');
    }
    if (!description) {
      missingFields.push('description');
    }

    if (missingFields.length > 0) {
      res.status(400).json({
        status: false,
        message: `The following fields are required: ${missingFields.join(
          ', '
        )}.`,
      });
      return;
    }

    const newProduct = {
      code,
      name,
      category,
      brand,
      type,
      description,
    };

    try {
      const product = await Product.create(newProduct);
      res.status(201).json({
        status: true,
        data: product,
        message: 'Product created successfully.',
      });
    } catch (err) {
      logger.error(JSON.stringify(err));
      res.status(500).json({
        status: false,
        message: 'Error creating product!',
        error: err,
      });
    }
  },

  updateProduct: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { code } = req.params;
    const { name, category, brand, type, description } = req.body;

    if (
      name === undefined &&
      category === undefined &&
      brand === undefined &&
      type === undefined &&
      description === undefined
    ) {
      res.status(400).json({
        status: false,
        message:
          'At least one field (name, category, brand, type, description) must be provided to update.',
      });
      return;
    }

    const updatedProductData: any = {};
    if (name) {
      updatedProductData.name = name;
    }
    if (category) {
      updatedProductData.category = category;
    }
    if (brand) {
      updatedProductData.brand = brand;
    }
    if (type) {
      updatedProductData.type = type;
    }
    if (description) {
      updatedProductData.description = description;
    }

    try {
      const [rowsUpdated] = await Product.update(updatedProductData, {
        where: { code },
      });

      if (rowsUpdated === 0) {
        res.status(404).json({
          status: false,
          message: 'Product not found.',
        });
        return;
      }

      res.status(200).json({
        status: true,
        message: 'Product updated successfully.',
      });
    } catch (err) {
      logger.error(JSON.stringify(err));

      res.status(500).json({
        status: false,
        message: 'Error updating product!',
        error: err,
      });
    }
  },

  deleteProduct: (req: Request, res: Response, next: NextFunction): void => {
    const { code } = req.params;

    Product.destroy({
      where: { code },
    })
      .then((deletedCount) => {
        if (deletedCount === 0) {
          return res.status(404).json({
            status: false,
            message: 'Product not found.',
          });
        }
        return res.status(200).json({
          status: true,
          message: 'Product deleted successfully.',
        });
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        return res.status(500).json({
          status: false,
          message: 'Error deleting product!',
          error: err,
        });
      });
  },
};

export default productApiController;
