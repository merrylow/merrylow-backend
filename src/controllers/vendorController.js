const vendorService = require('../services/vendorService');

// make sure the role of the user is vendor before allowing access to these routes
//  later modify the generate accessTOken to include the user roles as well


exports.getVendorRestaurant = async (req, res) => {
    try {
        const { vendorId, userRole } = req.user;
        if (userRole !== 'VENDOR') return res.status(403).json({ message: 'Forbidden' });

        const restaurants = await vendorService.getRestaurants(vendorId);

        if (!restaurants.length) return res.status(404).json({ message: 'No restaurants found' });

        return res.status(200).json(restaurants);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getVendorProducts = async (req, res) => {
    try {
        const { vendorId, userRole } = req.user;
        if (!userRole || userRole !== "VENDOR") {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const restaurantId = req.body.restaurantId || req.query.restaurantId;

        const products = await vendorService.getProducts(vendorId, restaurantId);

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this vendor' });
        }

        res.status(200).json(products);
    } catch (err) {
        const message = err.message === "Unauthorized access to restaurant"
            ? "You do not own the specified restaurant"
            : "Internal server error";

        console.error(err);
        res.status(500).json({ message });
    }
};


exports.addVendorRestaurant = async (req, res) => {
    try {
        const { vendorId, userRole } = req.user;

        if (userRole !== "VENDOR") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { name, phone, campusId, location, startTime, endTime } = req.body;

        if (!name || !phone || !campusId || !location || !startTime || !endTime) {
            return res.status(400).json({
                message: "Missing required fields: name, phone, campusId, location, startTime, and endTime are required.",
            });
        }

        const newRestaurant = await vendorService.addRestaurant({
            name,
            phone,
            campusId,
            location,
            startTime,
            endTime,
            ownerId: vendorId,
        });

        return res.status(201).json({
            message: "Restaurant submitted for approval.",
            restaurant: newRestaurant,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.updateVendorRestaurant = async (req, res) => {
    try {
        const {vendorId, userRole} = req.user;
        if (!userRole || userRole !== "VENDOR") return res.status(403).json({ message: 'Forbidden' });
        
        const restaurantId = req.params.id;
        if (!restaurantId ) return res.status(400).json({ message: 'Restaurant ID is required' });

        const updatedRestaurant = await vendorService.updateRestaurant(vendorId, restaurantId, req.body);
        if (!updatedRestaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        return res.status(200).json(updatedRestaurant);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.addVendorProduct = async (req, res) => {
    try {
        // since vendors can add products specific to just one of their restaurants if they have many
        // their restaurantId should be included in their body when they make the request

        const { vendorId, userRole } = req.user;
        if (userRole !== "VENDOR") {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // to add product we need; name, price, description?, category(will include that later to the DB), restaurantId, addOns?
        const { name, price, restaurantId, description, addOns } = req.body;

        if (!name || !price || !restaurantId) {
            return res.status(400).json({ message: 'name, price, and restaurantId are required' });
        }

        // NOTE: Add image validation later
        // since each product will have to displayed with images
        // (and we can't trust the vendors to upload the right images, we'll handle the logic later....)

        const newProduct = await vendorService.addProduct(vendorId, restaurantId, {
            name,
            price,
            description,
            addOns,
        });

        return res.status(201).json(newProduct);

    } catch (err) {
        console.error(err.message || err);
        return res.status(500).json({ message: err.message || 'Internal server error' });
    }
};


exports.updateVendorProduct = async (req, res) => {
    try {
        const { vendorId, userRole } = req.user;
        if (userRole !== "VENDOR") {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // to update a product we might need any of these; name?, price?, description?, category?(will include that later to the DB), restaurantId, addOns?, available?
        // but we'll have to validate the required fields (restaurantId && productId)

        const productId = req.params.id;
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const { restaurantId } = req.body;
        if (!restaurantId) {
            return res.status(400).json({ message: 'Restaurant ID is required' });
        }

        // NOTE: Image update handling will come later
        const updatedProduct = await vendorService.updateProduct(vendorId, productId, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found or unauthorized' });
        }

        return res.status(200).json(updatedProduct);

    } catch (err) {
        console.error(err.message || err);
        return res.status(500).json({ message: err.message || 'Internal server error' });
    }
};


exports.deleteVendorProduct = async (req, res) => {
    try {
        const { vendorId, userRole } = req.user;
        const productId = req.params.id;

        const restaurantId = req.body.restaurantId;
        if (!restaurantId) return res.status(400).json({ message: 'Restaurant ID is required' });

        if (!userRole || userRole !== "VENDOR") {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const deletedProduct = await vendorService.deleteProduct(vendorId, restaurantId, productId);
        return res.status(200).json({ deletedProduct });

    } catch (err) {
        console.error(err.message || err);
        return res.status(500).json({ message: err.message || 'Internal server error' });
    }
};


exports.deleteVendorRestaurant = async (req, res) => {
    try {
        const { vendorId, userRole } = req.user;
        const restaurantId = req.params.id;

        if (!restaurantId) {
            return res.status(400).json({ message: 'Restaurant ID is required' });
        }

        if (!userRole || userRole !== "VENDOR") {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const deletedRestaurant = await vendorService.deleteRestaurant(vendorId, restaurantId);
        return res.status(200).json({ deletedRestaurant });

    } catch (err) {
        console.error(err.message || err);
        return res.status(500).json({ message: err.message || 'Internal server error' });
    }
};
