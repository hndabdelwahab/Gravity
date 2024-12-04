from odoo import models, fields, api
from odoo.exceptions import ValidationError

class ProductTemplate(models.Model):
    _inherit = 'product.template'

    discount_percentage = fields.Float(
        string='Discount (%)',
        default=0.0,
        help='Discount percentage to be applied on the product price'
    )
    
    has_discount = fields.Boolean(
        string='Has Discount',
        compute='_compute_has_discount',
        store=True
    )
    
    discounted_price = fields.Monetary(
        string='Discounted Price',
        compute='_compute_discounted_price',
        currency_field='currency_id',
        store=True
    )

    @api.depends('discount_percentage')
    def _compute_has_discount(self):
        for product in self:
            product.has_discount = product.discount_percentage > 0

    @api.depends('list_price', 'discount_percentage')
    def _compute_discounted_price(self):
        for product in self:
            if product.discount_percentage:
                product.discounted_price = product.list_price * (1 - product.discount_percentage / 100)
            else:
                product.discounted_price = product.list_price

    @api.constrains('discount_percentage')
    def _check_discount_percentage(self):
        for product in self:
            if product.discount_percentage < 0 or product.discount_percentage > 100:
                raise ValidationError('Discount percentage must be between 0 and 100.')