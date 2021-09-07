const { body, validationResult } = require('express-validator');
const db = require("mongoose");


const HostelSchema = new db.Schema(
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
);

const dbHostel = db.model("Hotel", HostelSchema);


const checkHostel = () => [

	body("name").notEmpty().isString().trim(),
	body("address").notEmpty().isString().trim(),
	body("city").notEmpty().isString().trim(),
	body("country").notEmpty().isString().trim(),
	body("stars").notEmpty().isInt(),
	body("hasSpa").notEmpty().isBoolean(),
	body("hasPool").notEmpty().isBoolean(),
	body("priceCategory").notEmpty().isInt()
];

const validateHostel = (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {

		return res.status(422).json({
			errors: errors.array(),
		})
	}
	
	next()
};
  
const getAllHostels = async (req, res) => {

	if (Object.entries(req.query).length === 0) {

		return res.status(200).json(
			{
				hostels: await dbHostel.find()
			}
		)
	}

	if (!req.query.city || !req.query.stars) {

		return res.status(400)

	} else {

		const city = req.query.city;
		const stars = req.query.stars;

		const result = await dbHostel.find(
			{
				"city": { $regex: new RegExp("^" + city.toLowerCase(), "i") },
				"stars": stars
			}
		);

		if (result.length === 0) {

			return res.status(404)
		}

		res.status(200).json({

			hostels: result
		})
	}
};

const getHostelbyID = async (req, res) => {

	const result = await dbHostel.findById(req.params.id);

	result.length === 0
	?
		res.status(404)
	:
		res.status(302).json(
			{
				hostel: result
			}
		);
};

const createHostel = async (req, res) => {

	const errors = validationResult(req);

	if (!errors.isEmpty()) {

		return res.status(400).json(
			{
				errors: errors.array()
			}
		);
	}

	await dbHostel.create(req.body);

	res.status(200).json(
		{
			hostel: req.body
		}
	);
};

const updateHostel = async (req, res) => {

	const result = await dbHostel.findByIdAndUpdate(req.params.id, req.body, { new: true });

	if (!result) {

		return res.status(404);
	}

	res.status(202).json(
		{
			hostel: result
		}
	);
};

const deleteHostel = async (req, res) => {

	const result = await dbHostel.findOneAndDelete(req.params.id)

	if (!result) {

		return res.status(404);
	}

	res.status(200).json(
		{
			hostel: result
		}
	);
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
