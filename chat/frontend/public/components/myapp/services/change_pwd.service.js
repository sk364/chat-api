myapp
	.factory('ChangePwd', function($resource) {
		return $resource(
			'http://localhost:8000/api/auth/change_password/',
			{},
			{
				'update' : {
					method : "PUT",
					data : {password : '@password', cpassword : '@confirm_password'},
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