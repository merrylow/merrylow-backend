const vendorService = require('../services/vendorService');
const { sendError, sendSuccess } = require('../utils/responseHandler');


exports.getVendorRestaurant = async (req, res) => {
    try {
        const { id, userRole } = req.user;
        if (userRole !== 'VENDOR') return sendError(res, 403, 'Forbidden');

        const restaurants = await vendorService.getRestaurants(id);

        if (!restaurants || !restaurants.length) return sendError(res, 404, 'No restaurants found');

        return sendSuccess(res, 200, restaurants);
    } catch (err) {
        return sendError(res, 500, 'Internal server error', err);
    }
};


exports.getVendorRestaurantById = async (req, res) => {
    try {
        const { id, userRole } = req.user;
        const restaurantId = req.params.id

        if (!userRole || userRole !== "VENDOR") {
            return sendError(res, 403, 'Forbidden');
        }

        if (!restaurantId) return sendError(res, 400, 'Restaurant ID is required');

        const restaurant = await vendorService.getRestaurantById(id, restaurantId);
        if (!restaurant) {
            return sendError(res, 404, 'Restaurant not found');
        }

        return sendSuccess(res, 200, { data: restaurant });

    } catch (error) {
        return sendError(res, 500, 'Server Error', error);
    }
}


exports.getVendorProducts = async (req, res) => {
    try {
        const { id, userRole } = req.user;
        if (!userRole || userRole !== "VENDOR") {
            return sendError(res, 403, 'Forbidden');
        }

        const restaurantId = req.query?.restaurantId;

        const products = await vendorService.getProducts(id, restaurantId);

        if (!products || products.length === 0) {
            return sendError(res, 404, 'No products found for this vendor');
        }

        return sendSuccess(res, 200, products);
    } catch (err) {
        const message = err.message === "Unauthorized access to restaurant"
            ? "You do not own the specified restaurant"
            : "Internal server error";

        return sendError(res, 500, message, err);
    }
};


exports.getVendorProductById = async (req, res) => {
    try {
        const { id, userRole } = req.user;
        if (!userRole || userRole !== "VENDOR") {
            return sendError(res, 403, 'Forbidden');
        }

        const restaurantId = req.query?.restaurantId;

        const productId = req.params.id;

        const product = await vendorService.getProductById(id, restaurantId, productId);
        if (!product) {
            return sendError(res, 404, "Product not found");
        }
        return sendSuccess(res, 200, product);
    } catch (error) {
        return sendError(res, 500, 'Server Error', error);

    }
}


exports.addVendorRestaurant = async (req, res) => {
    try {
        const { id, userRole } = req.user;

        if (userRole !== "VENDOR") {
            return sendError(res, 403, "Forbidden");
        }

        const { name, phone, campusId, location, startTime, endTime } = req.body;

        if (!name || !phone || !campusId || !location || !startTime || !endTime) {
            return sendError(res, 400, "Missing required fields: name, phone, campusId, location, startTime, and endTime are required.");
        }

        const newRestaurant = await vendorService.addRestaurant({
            name,
            phone,
            campusId,
            location,
            startTime,
            endTime,
            ownerId: id,
        });

        return sendSuccess(res, 201, { restaurant: newRestaurant }, "Restaurant submitted for approval.");

    } catch (err) {
        return sendError(res, 500, "Internal server error", err);
    }
};


exports.updateVendorRestaurant = async (req, res) => {
    try {
        const {id, userRole} = req.user;
        if (!userRole || userRole !== "VENDOR") return sendError(res, 403, 'Forbidden');

        const restaurantId = req.params.id;
        if (!restaurantId ) return sendError(res, 400, 'Restaurant ID is required');

        const updatedRestaurant = await vendorService.updateRestaurant(id, restaurantId, req.body);
        if (!updatedRestaurant) {
            return sendError(res, 404, 'Restaurant not found or unauthorized');
        }

        return sendSuccess(res, 200, updatedRestaurant);

    } catch (err) {
        return sendError(res, 500, 'Internal server error', err);
    }
}


exports.addVendorProduct = async (req, res) => {
    try {
        // since vendors can add products specific to just one of their restaurants if they have many
        // their restaurantId should be included in their body when they make the request

        const { id, userRole } = req.user;
        if (userRole !== "VENDOR") {
            return sendError(res, 403, 'Forbidden');
        }

        // to add product we need; name, price, description?, category(will include that later to the DB), restaurantId, addOns?
        const { name, price, restaurantId, description, addOns } = req.body;

        if (!name || price === undefined || price === null || !restaurantId) { // Added price check
            return sendError(res, 400, 'name, price, and restaurantId are required');
        }

        // NOTE: Add image validation later
        // since each product will have to displayed with images
        // (and we can't trust the vendors to upload the right images, we'll handle the logic later....)

        const newProduct = await vendorService.addProduct(id, restaurantId, {
            name,
            price,
            description,
            addOns,
        });

        return sendSuccess(res, 201, newProduct);

    } catch (err) {
        return sendError(res, 500, err.message || 'Internal server error', err);
    }
};


exports.updateVendorProduct = async (req, res) => {
    try {
        const { id, userRole } = req.user;
        if (userRole !== "VENDOR") {
            return sendError(res, 403, 'Forbidden');
        }

        // to update a product we might need any of these; name?, price?, description?, category?(will include that later to the DB), restaurantId, addOns?, available?
        // but we'll have to validate the required fields (restaurantId && productId)

        const productId = req.params.id;
        if (!productId) {
            return sendError(res, 400, 'Product ID is required');
        }

        const { restaurantId } = req.body; 
        if (!restaurantId) {
            return sendError(res, 400, 'Restaurant ID is required');
        }

        // NOTE: Image update handling will come later
        const updatedProduct = await vendorService.updateProduct(id, productId, req.body);
        if (!updatedProduct) {
            return sendError(res, 404, 'Product not found or unauthorized');
        }

        return sendSuccess(res, 200, updatedProduct);

    } catch (err) {
        return sendError(res, 500, err.message || 'Internal server error', err);
    }
};


exports.deleteVendorProduct = async (req, res) => {
    try {
        const { id, userRole } = req.user;
        const productId = req.params.id;

        const restaurantId = req.query?.restaurantId;
        if (!restaurantId) return sendError(res, 400, 'Restaurant ID is required');

        if (!userRole || userRole !== "VENDOR") {
            return sendError(res, 403, 'Forbidden');
        }

        const deletedProduct = await vendorService.deleteProduct(id, restaurantId, productId);

        return sendSuccess(res, 200, { deletedProduct }, 'Product deleted successfully');

    } catch (err) {
        return sendError(res, 500, err.message || 'Internal server error', err);
    }
};


exports.deleteVendorRestaurant = async (req, res) => {
    try {
        const { id, userRole } = req.user;
        const restaurantId = req.params.id;

        if (!restaurantId) {
            return sendError(res, 400, 'Restaurant ID is required');
        }

        if (!userRole || userRole !== "VENDOR") {
            return sendError(res, 403, 'Forbidden');
        }

        // Service should handle cases where restaurant not found or unauthorized
        const deletedRestaurant = await vendorService.deleteRestaurant(id, restaurantId);
         // If service throws error on not found/unauthorized, catch block handles it.
         // If service returns null/undefined for not found, add check here before sending 200?
         // Assuming service throws errors on failure.

        return sendSuccess(res, 200, { deletedRestaurant }, 'Restaurant deleted successfully'); // Added success message

    } catch (err) {
        return sendError(res, 500, err.message || 'Internal server error', err);
    }
};


exports.getVendorOrders = async (req, res) => {
    const vendorId = req.user.id;
    const userRole  = req.user.userRole;

    if (userRole !== "VENDOR") {
        return sendError(res, 403, "Forbidden");
    }

    const { status } = req.query;
    try {
        const orders = await vendorService.fetchVendorOrders(vendorId, status);

        return sendSuccess(res, 200, { orders });

    } catch (err) {
        return sendError(res, 500, "Failed to fetch vendor orders", err);
    }
};


exports.getVendorOrderById = async (req, res) => {
    const vendorId = req.user.id;
    const { id } = req.params; 

    try {
        let order = await vendorService.fetchVendorOrderById(id, vendorId); 

        if (!order) {
            return sendError(res, 404, "Order not found or unauthorized");
        }

        return sendSuccess(res, 200, { order }); 

    } catch (err) {
        return sendError(res, 500, "Failed to fetch order details", err);
    }
};


exports.patchVendorOrderStatus = async (req, res) => {
    const vendorId = req.user.id;
    const { id } = req.params; 
    const { status } = req.body;

    const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED", "DECLINED", "ACCEPTED"];
    if (!status || !validStatuses.includes(status)) {
        return sendError(res, 400, "Invalid status value");
    }

    try {
        const updated = await vendorService.updateOrderStatus(id, vendorId, status);

        if (!updated) {
            return sendError(res, 404, "Order not found or unauthorized");
        }

        return sendSuccess(res, 200, { order: updated }, "Order status updated");

    } catch (err) {
        return sendError(res, 500, err.message || "Failed to update order status", err);
    }
};