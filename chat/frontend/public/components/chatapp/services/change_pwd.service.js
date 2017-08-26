chatapp.factory('ChangePwd', ['$resource', 'config', function($resource, config) {
	var changePwdUrl = config.apiUrl + 'api/change_password/';
	return $resource(
		changePwdUrl,
		{},
		{
			'update' : {
				method : "PUT",
				data : {password : '@password', confirm_password : '@confirm_password'},
				headers: {
					'Content-Type' : 'application/json'
				}
			}
		},
        {
            stripTrailingSlashes: false
        }
	);
}]);