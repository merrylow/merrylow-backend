const trendingService = require('../services/trendingService');
const { sendError, sendSuccess } = require('../utils/responseHandler');
const redisClient = require('../config/redis');

exports.getTopVendors = async (req, res) => {
    const cacheKey = 'top_vendors';

    try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            const vendors = JSON.parse(cached);
            return sendSuccess(res, 200, { source: 'cache', data: vendors });
        }

        const vendors = await trendingService.getTopVendors();
        await redisClient.set(cacheKey, JSON.stringify(vendors), 'EX', 43200); // for now this cache will be updated after every 12 hours, later i'll make sure the cache is deleted and resetted after every single order for freshness

        return sendSuccess(res, 200, { source: 'db', data: vendors });
    } catch (error) {
        return sendError(res, 500, 'Server Error', error);
    }
};

exports.getTopProducts = async (req, res) => {
    const cacheKey = 'top_products';

    try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            const products = JSON.parse(cached);
            return sendSuccess(res, 200, { source: 'cache', data: products });
        }

        const products = await trendingService.getTopProducts();
        await redisClient.set(cacheKey, JSON.stringify(products), 'EX', 43200);

        return sendSuccess(res, 200, { source: 'db', data: products });
    } catch (error) {
        return sendError(res, 500, 'Server Error', error);
    }
};
