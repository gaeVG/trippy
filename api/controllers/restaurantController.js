let restaurants =[
	{
		"id": 1,
		"name": "Les trois Mousquetaires",
		"address": "22 av des Champs-Élysées",
		"city": "Paris",
		"country": "France",
		"stars": 4,
		"cuisine": "french",
		"priceCategory": 3
	},
	{
		"id": 2,
		"name": "The Fat Guy",
		"address": "47 Jackson Boulevard",
		"city": "New York",
		"country": "US",
		"stars": 5,
		"cuisine": "burger",
		"priceCategory": 1
	},
	{
		"id": 3,
		"name": "Veggies",
		"address": "77 Avenir Street",
		"city": "Sydney",
		"country": "Australia",
		"stars": 5,
		"cuisine": "vegan",
		"priceCategory": 2
	}
]

const getAllRestaurants = (_req, res) => {
    
    res.json(
        {
            status: "OK",
            restaurants: restaurants
        }
    );
};

const getRestaurantbyID = (req, res) => {
    
	const result = restaurants.filter(restaurant => parseInt(req.params.id) === restaurant.id)

    result.length > 0 ? res.json({
        status: "OK",
        restaurants: result
    }) : res.json({
        status: "None",
    });
};

const createRestaurant = (req, res) => {

    const body = req.body

	const restaurant ={
		"id": restaurants.length + 1,
		"name": body.name,
		"address": body.address,
		"city": body.city,
		"country": body.country,
		"stars": body.stars,
		"cuisine": body.cuisine,
		"priceCategory": body.priceCategory,
	}

	restaurants.push(restaurant)

	res.json({
		status: "OK",
		restaurant: restaurant
	})
};

const updateRestaurant = (req, res) => {

	const result = restaurants.filter(restaurant => parseInt(req.params.id) === restaurant.id)

	Object.entries(req.query).forEach( ([k, v]) => {
		
		if (result[0][k]) {
			result[0][k] =v
		}
	});

	let update =restaurants.map(restaurant => 
		result[0].id === restaurant.id ? result[0] : restaurant
	);

	restaurants =update
	
	res.json({
		status: "OK",
		restaurant: result[0]
	})
};

const deleteRestaurant = (req, res) => {

    let restaurantToDelete = restaurants.filter(restaurant => {
        return parseInt(req.params.id) === restaurant.id
    })

    if (restaurantToDelete.length === 0) {

        return res.json({
            status: "Not found"
        })

    } else {

        restaurants = restaurants.filter(restaurant =>
            restaurantToDelete[0] !== restaurant
        );

        return res.json({
            status: "OK",
            restaurants: restaurants
        });
    }
}

module.exports ={
	getAllRestaurants : getAllRestaurants,
	getRestaurantbyID : getRestaurantbyID,
	createRestaurant : createRestaurant,
	updateRestaurant: updateRestaurant,
	deleteRestaurant: deleteRestaurant
};
