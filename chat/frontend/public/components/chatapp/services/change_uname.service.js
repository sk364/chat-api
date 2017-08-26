chatapp.factory('ChangeUsername', ['$resource', 'config', function($resource, config) {
	var changeUnameUrl = config.apiUrl + 'api/auth/change_username/';
	return $resource(
		changeUnameUrl,
		{},
		{
			'update' : {
				method : "PUT",
				data : {password : '@username'},
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