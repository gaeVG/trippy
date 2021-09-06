const { body, validationResult } = require('express-validator');

let hostels =[

	{
		"id": 1,
		"name": "Imperial Hotel",
		"address": "84 av des Champs-Élysées",
		"city": "Paris",
		"country": "France",
		"stars": 5,
		"hasSpa": true,
		"hasPool": true,
		"priceCategory": 3
	},
	{
		"id": 2,
		"name": "The Queen",
		"address": "3 Darwin Street",
		"city": "London",
		"country": "England",
		"stars": 4,
		"hasSpa": true,
		"hasPool": false,
		"priceCategory": 3
	},
	{
		"id": 3,
		"name": "Kiwi land",
		"address": "4587 George St.",
		"city": "Auckland",
		"country": "New-Zealand",
		"stars": 3,
		"hasSpa": false,
		"hasPool": true,
		"priceCategory": 2
	}
];

const checkHostel = () => [

	body("name").notEmpty(),
	body("address").notEmpty(),
	body("city").notEmpty(),
	body("country").notEmpty(),
	body("stars").notEmpty().toInt(),
	body("hasSpa").notEmpty().toBoolean(),
	body("hasPool").notEmpty().toBoolean(),
	body("priceCategory").notEmpty().toInt()
];

const validateHostel = (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {

		return res.status(422).json({
			errors: errors.array(),
		})
	}
	
	next()
}
  
const getAllHostels = (req, res) => {

	if (Object.entries(req.query).length === 0) {

		return res.json(
			{
				status: "OK",
				hostels: hostels
			}
		);
	}

	if (!req.query.city || !req.query.stars) {

		return res.status(400).json({
			status: "Bad query"
		})
	} else {

		const city = req.query.city.toLowerCase()
		const stars = parseInt(req.query.stars)

		const result = hostels.filter(hostel =>

			city === hostel.city.toLowerCase() && stars === hostel.stars
		)

		if (result.length === 0) {

			return res.status(400).json({
				status: "Not found"
			})
		}

		res.json({
			status: "OK",
			hostels: result
		})
	}
};

const getHostelbyID = (req, res) => {
    
	const result = hostels.filter(hostel => parseInt(req.params.id) === hostel.id)

    result.length > 0 ? res.json({
        status: "OK",
        hostels: result
    }) : res.json({
        status: "None",
    });
};

const createHostel = (req, res) => {

	console.log("coucou")
	const errors = validationResult(req)
	if (!errors.isEmpty()) {

		return res.status(400).json({
			status: "Error",
			errors: errors.array()
		})
	}

    const body = req.body
	
	const hostel ={
		"id": hostels.length + 1,
		"name": body.name,
		"address": body.address,
		"city": body.city,
		"country": body.country,
		"stars": body.stars,
		"hasSpa": body.hasSpa,
		"hasPool": body.hasSpa,
		"priceCategory": body.priceCategory,
	}

	hostels.push(hostel)

	res.json({
		status: "OK",
		hostel: hostel
	})
};

const updateHostel = (req, res) => {

	const result = hostels.filter(hostel => parseInt(req.params.id) === hostel.id)
	
	if (result.length === 0) {

		return res.json({
			status: "Not found",
			id: req.params.id
		})
	}

	Object.entries(req.query).forEach( ([k, v]) => {
		
		if (result[0][k]) {
			result[0][k] =v
		}
	});

	hostels =hostels.map(hostel => 
		result[0].id === hostel.id ? result[0] : hostel
	);
	
	res.json({
		status: "OK",
		hostel: result[0]
	})
};

const deleteHostel = (req, res) => {

	let hostelToDelete = hostels.filter(hostel => {
        return parseInt(req.params.id) === hostel.id
    })

    if (hostelToDelete.length === 0) {

        return res.json({
            status: "Not found"
        })

    }

	hostels = hostels.filter(hostel =>
		hostelToDelete[0] !== hostel
	);

	res.json({
		status: "OK",
		hostels: hostels
	});
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
