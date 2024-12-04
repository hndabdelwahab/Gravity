from odoo import api, models

class SaleOrderLine(models.Model):
    _inherit = 'sale.order.line'

    @api.onchange('product_id')
    def product_id_change(self):
        result = super().product_id_change()
        if self.product_id and self.product_id.has_discount:
            self.price_unit = self.product_id.discounted_price
        return result