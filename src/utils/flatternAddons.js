/**
 * Transforms the new nested addOns object structure into an array of { name, price } objects.
 * @param {object} newAddOns The addOns object from the Menu item.
 * @returns {Array<{name: string, price: number}>} An array of add-on objects.
 */

function flattenAddOns(newAddOns) {
    const flattened = [];

    for (const categoryKey in newAddOns) {
        if (Object.hasOwnProperty.call(newAddOns, categoryKey)) {
            const categoryObject = newAddOns[categoryKey];

            if (typeof categoryObject === 'object' && categoryObject !== null) {
                for (const addonName in categoryObject) {
                    if (Object.hasOwnProperty.call(categoryObject, addonName)) {
                        const addonPrice = categoryObject[addonName];

                        flattened.push({
                            name: addonName,
                            price: addonPrice
                        });
                    }
                }
            }
        }
    }

    return flattened;
}


module.exports = flattenAddOns;