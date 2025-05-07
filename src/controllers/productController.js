const productService = require('../services/productService');

/**
 * @desc Fetch paginated products, optionally filtered by name
 * @route GET /products
 * @queryParams
 *   - name (optional): Filter products by name (partial match, case-insensitive)
 *   - page (optional): Page number for pagination (default: 1)
 *   - limit (optional): Number of items per page (default: 10)
 *@overload
    *   - name: (optional) - if provided, filters products by name else returns all products
    * @example /products
    * 
 * @example
 *   /products?name=burger&page=2&limit=5
 */
exports.getProducts = async (req, res) => {
    try {
        const productName = req.query.name || null;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const products = await productService.getProducts(productName, limit, page);

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json({
            page,
            limit,
            products
        });

    } catch (error) {
        console.error("Product Fetch Error:", error);
        res.status(500).json({ message: "Error fetching products" });
    }
}


/**
 * @desc Fetch a single product by its ID
 * @route GET /products/:id
 *
 * @example
 *   /products/abc123
 */
exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Product Fetch by ID Error:", error);
        res.status(500).json({ message: "Error fetching product" });
    }
}
