module.exports = [


	/*
	 * Place your upgrade scripts here
	 * Remember that once it has been added it cannot be removed!
	 */
	 function (context, props) {
		self.log("debug", `---------------- upgrades def ` )

		return {
	 		updatedConfig: null,
	 		updatedActions: [],
	 		updatedFeedbacks: [],
	 	}
	 },
]
