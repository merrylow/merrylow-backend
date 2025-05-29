const Decimal = require('decimal.js');
const flattenAddOns = require('../utils/flatternAddons');

// since each addons could be in different forms like, quantity, customPrice but can be slided and changed within a range or custom, we need to process and calcualte the prices differently
function processSelectedAddons(selectedAddons, originalAddons, menu) {
    let addonsTotal = new Decimal(0);
    const description = {};
    description['name'] = `${menu.name} : ${menu.price}`;
    const menuAddOns = flattenAddOns(originalAddons);

    for (const selected of selectedAddons) {
        const found = menuAddOns.find((addon) => addon.name === selected.name);
        if (!found) throw new Error(`Invalid addon selected: ${selected.name}`);

        const addonBasePrice = new Decimal(found.price);
        let addonPrice;

        if (selected.quantity) {
            if (selected.quantity < 1 || !Number.isInteger(selected.quantity)) {
                throw new Error(`Invalid quantity for ${selected.name}`);
            }

            addonPrice = addonBasePrice.times(selected.quantity);
            description[selected.name] = {
                type: 'quantity',
                quantity: selected.quantity,
                pricePerUnit: Number(addonBasePrice),
                total: Number(addonPrice),
            };
        } else if (selected.customPrice) {
            const custom = new Decimal(selected.customPrice);
            if (custom.lessThan(addonBasePrice)) {
                throw new Error(
                    `${selected.name} price must be at least ${addonBasePrice.toFixed(2)}`,
                );
            }

            addonPrice = custom;
            description[selected.name] = {
                type: 'custom',
                customPrice: Number(custom),
            };
        } else {
            addonPrice = addonBasePrice;
            description[selected.name] = Number(addonBasePrice);
        }
        addonsTotal = addonsTotal.plus(addonPrice);
    }

    return {
        addonsTotal,
        description,
    };
}

module.exports = processSelectedAddons;
