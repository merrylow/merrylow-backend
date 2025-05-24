const productService = require('../services/productService');
const { sendError, sendSuccess } = require('../utils/responseHandler');

/**
 * @desc Fetch paginated products, optionally filtered by name
 * @route GET /products
 * @queryParams
 * - name (optional): Filter products by name (partial match, case-insensitive)
 * - page (optional): Page number for pagination (default: 1)
 * - limit (optional): Number of items per page (default: 10)
 *@overload
 * - name: (optional) - if provided, filters products by name else returns all products
 * @example /products
 *
 * @example
 * /products?name=burger&page=2&limit=5
 */
exports.getProducts = async (req, res) => {
    try {
        const productName = req.query.name || null;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const products = await productService.getProducts(productName, limit, page);

        if (!products || products.length === 0) { 
            return sendError(res, 404, "No products found");
        }

        return sendSuccess(res, 200, {
            page,
            limit,
            products
        });

    } catch (error) {
        return sendError(res, 500, "Error fetching products", error);
    }
}


/**
 * @desc Fetch a single product by its ID
 * @route GET /products/:id
 *
 * @example
 * /products/abc123
 */
exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productService.getProductById(productId);

        if (!product) {
            return sendError(res, 404, "Product not found");
        }

        return sendSuccess(res, 200, { data : product});

    } catch (error) {
        return sendError(res, 500, "Error fetching product", error);
    }
}