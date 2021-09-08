const { response } = require('express');
const { body, validationResult } = require('express-validator');
const db = require("mongoose");

const model = db.model("Hotel",

	new db.Schema(
		{
			name: {
				type: String,
				required: true
			},
			address: {
				type: String,
				required: true
			},
			city: {
				type: String,
				required: true
			},
			country: {
				type: String,
				required: true
			},
			stars: {
				type: Number,
				required: true
			},
			hasSpa: {
				type: Boolean,
				required: true
			},
			hasPool: {
				type: Boolean,
				required: true
			},
			priceCategory: {
				type: Number,
				required: true
			},
		}
	)
);


const checkHostel = () => [

	body("name").notEmpty().isString().trim(),
	body("address").notEmpty().isString().trim(),
	body("city").notEmpty().isString().trim(),
	body("country").notEmpty().isString().trim(),
	body("stars").notEmpty().not().isString().isInt({ min: 1, max: 5 }),
	body("hasSpa").notEmpty().isBoolean(),
	body("hasPool").notEmpty().isBoolean(),
	body("priceCategory").notEmpty().not().isString().isInt({ min: 1, max: 3 })
];

const validateHostel = (request, response, next) => {
	const errors = validationResult(request)

	if (!errors.isEmpty()) {

		return response.status(422).json({
			errors: errors.array(),
		})
	}
	
	next()
};
  
const getAllHostels = async (request, response) => {

	if (Object.entries(request.query).length === 0) {
		
		const result = await model.find();

		result.length === 0
		?
			response.status(404).json(
				{
					hostels: []
				}
			)
		:
			response.status(200).json(
				{
					hostels: await model.find()
				}
		)

		return
	}

	if (!request.query.city || !request.query.stars) {

		response.status(400)

	} else {

		const city = request.query.city;
		const stars = request.query.stars;

		const result = await model.find(
			{
				"city": { $regex: new RegExp("^" + city.toLowerCase(), "i") },
				"stars": stars
			}
		);

		result.length === 0
		?
			response.status(404).json(
				{
					hostels: []
				}
			)
		:
			response.status(302).json(
				{
					hostels: result
				}
			)
	}
};

const getHostelbyID = async (request, response) => {

	const result = await model.findById(request.params.id);

	result === null
	?
		response.status(404).json(
			{
				hostel: []
			}
		)
	:
		response.status(302).json(
			{
				hostel: result
			}
		);
};

const createHostel = async (request, response) => {

	const errors = validationResult(request);

	if (!errors.isEmpty()) {

		response.status(400).json(
			{
				errors: errors.array()
			}
		);

		return
	}

	await model.create(request.body);

	response.status(201).json(
		{
			hostel: request.body
		}
	);
};

const updateHostel = async (request, response) => {

	const result = await model.findByIdAndUpdate(request.params.id, request.body, { new: true });

	!result
	?
		response.status(404).json(
			{
				hostel: []
			}
		)
	:
		response.status(200).json(
			{
				hostel: result
			}
		)
}

const deleteHostel = async (request, response) => {

	const result = await model.findOneAndDelete(request.params.id)

	!result
	?
		response.status(404).json(
			{
				hostel: []
			}
		)
	:
		response.status(200).json(
			{
				hostel: result
			}
		)
}

module.exports ={
	checkHostel: checkHostel,
	validateHostel: validateHostel,
	getAllHostels: getAllHostels,
	getHostelbyID: getHostelbyID,
	createHostel: createHostel,
	updateHostel: updateHostel,
	deleteHostel: deleteHostel
};
