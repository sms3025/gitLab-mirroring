const Crew = require('../models/crew');



module.exports.showRanking = async (req, res) => {
    const crewId = req.params.crewId;

    const foundCrew = await Crew.findById(crewId)
        .populate('users.user')

    const foundUser = foundCrew.users.slice();
    const ranking = foundUser.sort((a, b) => {
        if (a.count === b.count) {
            const aString = a.user.nickname.toString();
            const bString = b.user.nickname.toString();
            return aString.localeCompare(bString);
        }
        return b.count - a.count;
    });

    const result = {
        ranking: ranking
    }
    res.status(200).send(result);
}

module.exports.updateRanking = async () => {
    const allCrews = await Crew.find({});
    allCrews.forEach(crew => {
        crew.users.forEach(user => {
            user.count = 0;
        })
    })

}
