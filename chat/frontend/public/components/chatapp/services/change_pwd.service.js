myapp
	.factory('ChangePwd', function($resource) {
		return $resource(
			'http://localhost:8000/api/change_password/',
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
	}
);