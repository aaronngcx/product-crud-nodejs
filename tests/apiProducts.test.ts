import request from 'supertest';
import { Product } from '../src/models/product'; // Ensure this is the correct path
import server from '../src/server';

jest.mock('../src/models/product', () => {
  return {
    Product: {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    },
  };
});

describe('API Products Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create new product', async () => {
    // Mock the create method
    (Product.create as jest.Mock).mockResolvedValueOnce({
      code: 'P101',
      name: 'Tall Basket',
      category: 'Home Decoration',
      brand: null,
      type: null,
      description: 'The next super product of the year.',
    });

    const res = await request(server).post('/api/products').send({
      code: 'P101',
      name: 'Tall Basket',
      category: 'Home Decoration',
      brand: null,
      type: null,
      description: 'The next super product of the year.',
    });

    expect(res.status).toEqual(201);
  });

  it('should update existing product', async () => {
    // Mock the update method
    (Product.update as jest.Mock).mockResolvedValueOnce([1]); // Assuming one record is updated

    const res = await request(server).put('/api/products/P003').send({
      description: 'Updated description',
    });

    expect(res.status).toEqual(200);
  });

  it('should return null when product is not found', async () => {
    (Product.findOne as jest.Mock).mockResolvedValueOnce(null);

    const res = await request(server).get('/api/products/P999');
    expect(res.status).toEqual(404);
  });

  it('should return error for missing product code on update', async () => {
    const res = await request(server).put('/api/products/').send({
      description: 'Updated description',
    });
    expect(res.status).toEqual(404);
  });

  it('should delete existing product', async () => {
    (Product.destroy as jest.Mock).mockResolvedValueOnce(1);

    const res = await request(server).delete('/api/products/P005');
    expect(res.status).toEqual(200);
  });

  it('should return error for non-existent product on delete', async () => {
    (Product.destroy as jest.Mock).mockResolvedValueOnce(0);

    const res = await request(server).delete('/api/products/P999');
    expect(res.status).toEqual(404);
  });

  it('should return error for missing product code on delete', async () => {
    const res = await request(server).delete('/api/products/');
    expect(res.status).toEqual(404); // Expecting 404 for missing code
  });

  it('should return error when failing to insert product', async () => {
    (Product.create as jest.Mock).mockRejectedValueOnce(
      new Error('Insertion failed')
    );

    const res = await request(server).post('/api/products').send({
      code: 'P101',
      name: 'Tall Basket',
      category: 'Home Decoration',
      brand: 'abc',
      type: 'def',
      description: 'The next super product of the year.',
    });

    expect(res.status).toEqual(500);
  });

  it('should return error when failing to update product', async () => {
    (Product.update as jest.Mock).mockRejectedValueOnce(
      new Error('Update failed')
    );

    const res = await request(server).put('/api/products/P003').send({
      description: 'Updated description',
    });

    expect(res.status).toEqual(500); // Expecting 500 for server error
  });
});
