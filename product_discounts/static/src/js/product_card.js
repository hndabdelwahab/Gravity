/** @odoo-module */

import publicWidget from '@web/legacy/js/public/public_widget';

publicWidget.registry.WebsiteSaleDiscount = publicWidget.Widget.extend({
    selector: '.oe_website_sale',
    events: {
        'change input.js_quantity': '_onChangeQuantity',
        'change input.js_variant_change': '_onChangeVariant',
        'change select.js_variant_change': '_onChangeVariant',
    },

    /**
     * @override
     */
    start() {
        console.log('WebsiteSaleDiscount widget starting...');
        return this._super(...arguments).then(() => {
            console.log('Initializing price updates...');
            this._updateAllPrices();
        });
    },

    /**
     * Updates all product prices in the page
     * @private
     */
    _updateAllPrices() {
        const products = this.el.querySelectorAll('.o_wsale_product_grid_wrapper, .oe_product_cart');
        console.log('Found products:', products.length);
        
        products.forEach((product, index) => {
            if (product) {
                console.log(`Updating product ${index + 1}:`);
                this._updateProductPrice(product);
            }
        });
    },

    /**
     * Updates a single product's price display
     * @private
     * @param {HTMLElement} productEl - The product container element
     */
    _updateProductPrice(productEl) {
        if (!productEl) {
            console.log('Product element is null');
            return;
        }

        const priceContainer = productEl.querySelector('.product_price, [name="website_sale_cart_line_price"]');
        if (!priceContainer) {
            console.log('Price container not found');
            return;
        }

        // Log the data attributes
        console.log('Price container data:', {
            hasDiscount: priceContainer.dataset.hasDiscount,
            listPrice: priceContainer.dataset.listPrice,
            discountPercentage: priceContainer.dataset.discountPercentage
        });

        const hasDiscount = priceContainer.dataset.hasDiscount === 'true';
        const listPrice = parseFloat(priceContainer.dataset.listPrice || 0);
        const discountPercentage = parseFloat(priceContainer.dataset.discountPercentage || 0);
        
        console.log('Parsed values:', {
            hasDiscount,
            listPrice,
            discountPercentage
        });

        if (hasDiscount && discountPercentage > 0 && listPrice > 0) {
            const discountMultiplier = (100 - discountPercentage) / 100;
            const discountedPrice = listPrice * discountMultiplier;
            
            console.log('Calculated values:', {
                discountMultiplier,
                discountedPrice
            });

            // Original price update
            const originalPriceEl = priceContainer.querySelector('del .text-danger, del span');
            if (originalPriceEl) {
                originalPriceEl.textContent = this._formatCurrency(listPrice);
                console.log('Updated original price');
            } else {
                console.log('Original price element not found');
            }

            // Discounted price update
            const discountedPriceEl = priceContainer.querySelector('.oe_price span, span:not(.badge)');
            if (discountedPriceEl) {
                discountedPriceEl.textContent = this._formatCurrency(discountedPrice);
                console.log('Updated discounted price');
            } else {
                console.log('Discounted price element not found');
            }

            // Badge update
            const badgeEl = priceContainer.querySelector('.badge.text-bg-danger');
            if (badgeEl) {
                badgeEl.textContent = `-${Math.round(discountPercentage)}%`;
                console.log('Updated discount badge');
            } else {
                console.log('Discount badge not found');
            }
        } else {
            console.log('Discount conditions not met:', {
                hasDiscount,
                discountPercentage,
                listPrice
            });
        }
    },

    /**
     * Formats currency according to Odoo settings
     * @private
     * @param {number} amount - The amount to format
     * @returns {string} Formatted amount
     */
    _formatCurrency(amount) {
        const mainContainer = this.el.closest('.oe_website_sale');
        console.log('Currency formatting container:', mainContainer);
        
        const currencySymbol = (mainContainer && mainContainer.dataset.currencySymbol) || '$';
        const currencyPosition = (mainContainer && mainContainer.dataset.currencyPosition) || 'before';
        const precision = parseInt((mainContainer && mainContainer.dataset.precision) || 2);
        
        console.log('Currency settings:', {
            currencySymbol,
            currencyPosition,
            precision
        });

        const formattedAmount = Number(amount).toFixed(precision);
        const parts = formattedAmount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const finalAmount = parts.join('.');
        
        const result = currencyPosition === 'after' 
            ? `${finalAmount} ${currencySymbol}`
            : `${currencySymbol} ${finalAmount}`;
            
        console.log('Formatted amount:', result);
        return result;
    },

    /**
     * Handles quantity change events
     * @private
     */
    _onChangeQuantity(ev) {
        console.log('Quantity changed');
        const product = ev.currentTarget.closest('.o_wsale_product_grid_wrapper, .oe_product_cart');
        if (product) {
            this._updateProductPrice(product);
        }
    },

    /**
     * Handles variant change events
     * @private
     */
    _onChangeVariant(ev) {
        console.log('Variant changed');
        const product = ev.currentTarget.closest('.o_wsale_product_grid_wrapper, .oe_product_cart');
        if (product) {
            this._updateProductPrice(product);
        }
    },
});

export default publicWidget.registry.WebsiteSaleDiscount;