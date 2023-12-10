const ExpressError = require('../utils/ExpressError');
const Diary = require('../models/diary');
const User = require('../models/user');

module.exports.showHomepage = async (req, res) => {
    const userId = req.user._id;
    const foundUser = await User.findById(userId).populate('crews');
    if (!foundUser) {
        throw new ExpressError("The requested user is not here.", 400);
    }
    const crewList = foundUser.crews.map(crew => {
        const c = {
            id: crew._id,
            name: crew.crewname,
            image: crew.image,
            exercise: crew.exercise,
            cycle: crew.cycle,
            description: crew.description
        };
        return c;
    })

    const needMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const refDate = new Date(currentYear, needMonth, 1);
    const endDate = new Date();
    endDate.setMonth(refDate.getMonth() + 1);

    const foundDiary = await Diary.find({ uploadtime: { $gte: refDate, $lt: endDate }, _id: userId })
        .sort({ 'uploadtime': 1 });



    const diaryList = [[]];
    foundDiary.forEach(diary => {
        const day = diary.uploadtime.getDate();
        diaryList[day].push(diary)
    })
    const result = {
        crews: crewList,
        records: diaryList
    }

    res.status(200).send(result);
}

module.exports.initHomepage = async (req, res) => {
    const userId = req.user._id;

    const foundUser = await User.findById(userId).populate('crews');
    if (!foundUser) {
        throw new ExpressError("The requested user is not here.", 400);
    }
    const crewList = foundUser.crews.map(crew => {
        const c = {
            id: crew._id,
            name: crew.crewname,
            image: crew.image,
            exercise: crew.exercise,
            cycle: crew.cycle,
            description: crew.description
        };
        return c;
    })

    
    const needMonth = new Date().getUTCMonth();
    const currentYear = new Date().getUTCFullYear();
    const refDate = new Date(currentYear, needMonth, 1);
    const endDate = new Date(currentYear, needMonth + 1, 1);
   

    const foundDiary = await Diary.find({ uploadtime: { $gte: refDate, $lt: endDate }, author: userId })
        .sort({ 'uploadtime': 1 });

    const diaryList = new Array(32).fill(0);
    foundDiary.forEach(diary =>{
        const day= diary.uploadtime.getDate();

        diaryList[day] = 1;
    })
    const result = {
        crews: crewList,
        records: diaryList
    }

    res.status(200).send(result);
}

module.exports.getDiaryByDate = async (req, res) => {
    const userId = req.user._id;
    
    const needMonth = new Date().getUTCMonth();
    const needDay = req.params.day;
    const currentYear = krDate.getUTCFullYear();

    const refDate = new Date(currentYear, needMonth, needDay);
    const endDate = new Date(currentYear, needMonth, needDay + 1);
    

    const foundDiary = await Diary.find({ uploadtime: { $gte: refDate, $lt: endDate }, author: userId })
        .populate('crew')
        .sort({ 'uploadtime': 1 })
    const diaryList = foundDiary.map(diary => {
        const d = {
            id: diary._id,
            type: diary.type,
            time: diary.time,
            memo: diary.memo,
            uploadtime: diary.uploadtime,
            crewname: diary.crew.crewname
        }
        return d;
    })


    const result = {
        records: diaryList
    };

    res.status(200).send(result);
}
