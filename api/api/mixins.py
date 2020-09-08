class GetLoginUserMixin:
    """
    Getで来たauth0_idを取得するメソッド
    Viewsetなどで継承して使う
    """

    def set_auth0_id(self, request):
        if 'auth0_id' in request.query_params:
            self.auth0_id = request.query_params['auth0_id']


    def get_auth0_id(self):
        return getattr(self, 'auth0_id', None)


    def set_ordering_type(self, request):
        if 'ordering_type' in request.query_params:
            self.ordering_type = request.query_params['ordering_type']


    def get_ordering_type(self):
        return getattr(self, 'ordering_type', None)