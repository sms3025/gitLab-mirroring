const Crew = require('../models/crew');
const Diary = require('../models/diary');
const ExpressError = require('../utils/ExpressError');

module.exports.showRanking = async (req, res) => {
    // const crewId = req.params.id;
    // const rank = Rank.find({ crew: crewId })
    //     .populate('ranking.user')
    //     .sort({ 'ranking.count': -1, 'ranking.user.nickname': 1 });
    // const ranks = rank.ranking;
    // res.status(200).send(ranks);
}

// User db에서 운동기록 (날짜기준은 한달)
// const now = new Date();
// const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

// const users = crew.users;
// const userRecord = [];
// users.forEach(async (user) => {
//     const userDiaries = await Diary.find({author:user._id, uploadtime:{$gte:oneMonthAgo}});
//     const userCount = userDiaries.length;
//     const userObject = {
//         name: user.name,
//         count: userCount
//     }
//     userRecord.push(userObject);
// })

//sort?