const ExpressError = require('../utils/ExpressError');
const Crew = require('../models/crew');

module.exports.showExplores = async (req, res) => {
    const crews = await Crew.find({});
    if (!crews) {
        throw new ExpressError('Empty crew list', 404);
    }
    const result = { crews: crews };
    res.status(200).send(result);
}