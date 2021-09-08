const { body, validationResult } = require('express-validator');
const db = require("mongoose")

const model = db.model("Restaurant",

	new db.Schema({

		name: 
		{
			type: String,
			required: true
		},
		address:
		{
			type: String,
			required: true
		},
		city:
		{
			type: String,
			required: true
		},
		country:
		{
			type: String,
			required: true
		},
		stars:
		{
			type: Number,
			required: true
		},
		cuisine:
		{
			type: String,
			required: true
		},
		priceCategory:
		{
			type: Number,
			required: true
		},
	})
);

const checkRestaurant = () => [

	body("name").notEmpty().isString().trim(),
	body("address").notEmpty().isString().trim(),
	body("city").notEmpty().isString().trim(),
	body("country").notEmpty().isString().trim(),
	body("stars").notEmpty().toInt(),
	body("cuisine").notEmpty(),
	body("priceCategory").notEmpty().toInt()
];

const validateRestaurant = (request, response, next) => {

	const errors = validationResult(request)

	if (!errors.isEmpty()) 

		return response.status(422).json({
			errors: errors.array(),
		})
	
	next()
}

const getAllRestaurants = async (request, response) => {
	
	if (Object.entries(request.query).length === 0) {

		const result = await model.find();
		
		result.length === 0
		?
			response.status(404).json(
				{
					restaurants: []
				}
			)
		:
			response.status(200).json(
				{
					restaurants: await model.find()
				}
			)

		return
	}

	if (!request.body.city || !request.body.cuisine) response.status(400)

	else {

		const city = request.body.city.toLowerCase()
		const cuisine = request.body.cuisine.toLowerCase()

		const result = await model.find(
			{
				"city": { $regex: new RegExp("^" + city.toLowerCase(), "i") },
				"cuisine": { $regex: new RegExp("^" + cuisine.toLowerCase(), "i") }
			}
		);
		
		result.length === 0
		?
			response.status(404).json(
				{
					restaurant: []
				}
			)
		:
			response.status(302).json(
				{
					restaurants: result
				}
			)
	}
};

const getRestaurantbyID = async (request, response) => {

	const result = await model.findById(request.params.id);

	result === null
	?
		response.status(404).json(
			{
				restaurant: []
			}
		)
		
	:
		response.status(302).json(
			{
				restaurant: result
			}
		);
};

const createRestaurant = async (request, response) => {

	const errors = validationResult(request)

	if (!errors.isEmpty()) {

		return response.status(400).json(
			{
				errors: errors.array()
			}
		);
	}

	await model.create(request.body)

	response.status(201).json(
		{
			restaurant: request.body
		}
	);
};

const updateRestaurant = async (request, response) => {

	const result = await model.findByIdAndUpdate(request.params.id, request.body, { new: true })

	!result
	?
		response.status(404).json(
			{
				restaurant: []
			}
		)
	:
		response.status(200).json(
			{
				restaurant: result
			}
		)
};

const deleteRestaurant = async (request, response) => {

	const result = await model.findByIdAndDelete(request.params.id)

	result === null
	?
		response.status(404).json(
			{
				deleted: []
			}
		)
	:
		response.status(302).json(
			{
				deleted: result
			}
		);
}

module.exports ={
	checkRestaurant: checkRestaurant,
	validateRestaurant: validateRestaurant,
	getAllRestaurants : getAllRestaurants,
	getRestaurantbyID : getRestaurantbyID,
	createRestaurant : createRestaurant,
	updateRestaurant: updateRestaurant,
	deleteRestaurant: deleteRestaurant
};
