{
    'name': 'Product Discounts',
    'version': '17.0.1.0.0',
    'category': 'Website/Website',
    'summary': 'Add discount feature to products in eCommerce',
    'description': """
        This module adds a discount percentage field to products and displays
        discounted prices in the eCommerce store.
    """,
    'depends': [
        'website_sale',
        'product',
        'sale',
    ],
    'data': [
        'security/ir.model.access.csv',
        'views/product_template_view.xml',
        'views/website_sale_templates.xml',
        'views/cart_templates.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'product_discounts/static/src/js/product_card.js',
        ],
    },  
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',
}