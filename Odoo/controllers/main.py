from collections import defaultdict

from odoo import http
from odoo.http import request, Response
import json
import xmlrpc.client

class APIController(http.Controller):
    @http.route('/get_session_id', type='http', auth='user')
    def get_session_id(self):
        # Define the server URL and database name
        server_url = 'https://localhost:8069'
        db_name = 'odoo'
        login = 'xyz@gmail.com'
        password = 'odoo'

        # Authenticate to the server and get the session ID
        common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(server_url))
        uid = common.authenticate(db_name, login, password, {})
        models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(server_url))
        session_id = models.execute_kw(db_name, uid, password, 'res.users', 'read', [uid], {'fields': ['session_id']})

        # Return the session ID as a response
        return session_id[0]['session_id']

    @http.route('/api/login/', type="http", auth="public", methods=['POST'], csrf=False)
    def login(self, **post):
        """Handle user login"""

        # Get user credentials from request parameters
        login = request.params.get('login')
        password = request.params.get('password')
        db = request.params.get('db')

        if not login or not password:
            return Response(response=json.dumps({'error': 'Please 3provide both email and password'}),
                            content_type='application/json', status=400)

        # Authenticate the user
        try:
            uid = request.session.authenticate(db, login, password)
        except Exception as e:
            return Response(response=json.dumps({'error': str(e)}),
                            content_type='application/json', status=400)

        if not uid:
            return Response(response=json.dumps({'error': 'Invalid credentials'}),
                            content_type='application/json', status=400)

        # Retrieve user data
        user = request.env['res.users'].sudo().browse(uid)
        response_data = {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'db' : db,
            # Add any other fields you want to include in the response
        }

        return Response(response=json.dumps(response_data), content_type='application/json')
    
    @http.route('/api/v1/products/', methods=["GET"], type='http', auth='public', csrf=False)
    def list_products(self, **post):

        name = post.get('name')
        name = name.lower()
        barcode = post.get('barcode')

        search_param = []
        if(name == ''):
            if barcode == '': search_param = [] 
            else: search_param = [('barcode', '=', barcode)]
        else:
            if barcode == '':
                search_param = [('name', 'ilike', '%' + name + '%')] 
            else: search_param = [('barcode', '=', barcode), ('name', 'ilike', '%' + name + '%')]
        # Fetch products data
        products = request.env['product.product'].search(search_param)
        
        # Return JSON response
        return Response(response=json.dumps([{
            'id': p['id'], 
            'name': p['name'],
            'barcode': p['barcode'],
            'list_price': p['list_price'],      #Sale Price#
            'color': p['color'],
            'default_code': p['default_code'],  #internal reference#
            'categories': [category.name for category in p.categ_id],
            'image_url': '/web/image/product.product/%s/image_1024' % p.id,
            'standard_price': p.standard_price
        } for p in products]), content_type='application/json')
    
    @http.route('/api/v1/products_field/', methods=["GET"], type='http', auth='public', csrf=False)
    def field_products(self):
        return Response(response=json.dumps("This is API apply."), content_type='application/json')
    
    @http.route('/api/product/', auth='public', type='http', methods=['POST'], csrf=False)
    def get_product_data(self, **kw):
        product_id = request.params.get('product_id')
        product_id = int(product_id)  # Convert the parameter to an integer
        product = http.request.env['product.product'].browse(product_id)
        response_data = {
            'name': product.name,
            'description': product.description_sale,
            'list_price': product.list_price,
            'categories': [category.name for category in product.categ_id],
            'color': product.color,
            'default_code': product.default_code,  #internal reference#
            'image_url': '/web/image/product.product/%s/image_1024' % product.id,
            'standard_price': product.standard_price
            # Add additional fields as needed
        }
        return json.dumps(response_data)
    
    @http.route('/api/product/create/', auth='public', type='http', methods=['POST'], csrf=False)
    def create_product(self, **post):

        data = json.loads(request.httprequest.data)
        data['list_price'] = round(float(data['list_price']), 3)
        data['standard_price'] = round(float(data['standard_price']), 3)
        try:
            new_product = http.request.env['product.product'].create(data)
        except Exception as e:
            return Response(response=json.dumps({'error': str(e)}),
                            content_type='application/json', status=400)

        
        return json.dumps({
            'id': new_product.id,
            'name': new_product.name,
            # 'description': new_product.description_sale,
            'list_price': new_product.list_price,
            'default_code': new_product.default_code,
            'barcode': new_product.barcode,
            'categories': [category.name for category in new_product.categ_id],
            'image_url': '/web/image/product.product/%s/image_1024' % new_product.id,
            'standard_price': new_product.standard_price,
            # Add additional fields as needed
        })

    @http.route('/api/delete/product', auth='public', type='http', methods=['POST'], csrf=False)
    def delete_product(self, **kw):
        product_id = request.params.get('product_id')
        product_id = int(product_id)  # Convert the parameter to an integer

        Product = request.env['product.product']
        product = Product.browse(product_id)

        product.unlink()

        return Response('Product(s) successfully deleted.', status=200)

    @http.route('/api/update/product', type='http', auth='public', methods=['POST'], csrf=False)
    def update_product(self, **kw):
    
        data = json.loads(request.httprequest.data)


        product_id = data['product_id']
        product_id = int(product_id)  # Convert the parameter to an integer
        
        name = data['name']
        list_price = round(float(data['list_price']), 3)
        standard_price = round(float(data['standard_price']), 3)
        barcode = data['barcode']
        default_code = data['default_code']

        json_product = {
            'name': name,
            'list_price': list_price,
            'standard_price': standard_price,
            'barcode': barcode,
            'default_code': default_code
        }
        
        try:
            product = http.request.env['product.product'].browse(product_id)

            if(product.barcode == barcode):
                json_product = {
                    'name': name,
                    # 'description_sale': description_sale,
                    'list_price': list_price,
                    'standard_price': standard_price,
                    'default_code': default_code
                }

            product.write(json_product)
        except Exception as e:
            return Response(response=json.dumps({'error': str(e)}),
                            content_type='application/json', status=400)
        
        return json.dumps(json_product)

    @http.route('/api/v1/test/', methods=["GET"], type='http', auth='public', csrf=False)
    def field_products1(self):
        return Response(response=json.dumps("This is test API apply."), content_type='application/json')