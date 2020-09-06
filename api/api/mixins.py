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