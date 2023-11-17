const ExpressError = require('../utils/ExpressError');
const Diary = require('../models/diary');
const User = require('../models/user');

module.exports.showHomepage = async (req, res) => {
    const userId = req.user._id;
    const needMonth = req.body.month;
    const foundUser = await User.findById(userId).populate('crews');
    const currentYear = new Date().getFullYear();

    const refDate = new Date(currentYear, needMonth, 1);
    const endDate = refDate.setMonth(refDate.getMonth() + 1);
    
    const foundDiary = await Diary.find({ uploadtime: { $gte: refDate, $lt: endDate }, _id: userId })
        .sort({ 'uploadtime': 1 });

    const diaryList = [[]];
    foundDiary.forEach(diary => {
        const day = diary.uploadtime.getDay();
        diaryList[day].push(diary)
    })
    const result = {
        crews: foundUser.crews,
        records: diaryList
    }

    res.status(200).send(result);
}