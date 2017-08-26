chatapp.factory('ChangeUsername', function($resource) {
	return $resource(
		'http://localhost:8000/api/auth/change_username/',
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
});