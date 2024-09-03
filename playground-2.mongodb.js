/* global use, db */
// MongoDB Playground
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Variables
const selectDB = 'zenclass'
const attendanceCollection = 'attendance';
const codekataCollection = 'codekata';
const companydrivesCollection = 'company_drives';
const mentorsCollection = 'mentors';
const tasksCollection = 'tasks';
const topicsCollection = 'topics';
const usersCollection = 'users';


// Select the database to use.
use(selectDB);

// Finding Topics and Tasks in October:
db.getCollection(topicsCollection).find({ date: { $gte: ISODate("2024-10-01T00:00:00Z"), $lte: ISODate("2024-10-31T23:59:59Z") } })

// Finding Company Drives Between October 15 - 31, 2020:
db.companyDrives.find({ date: { $gte: ISODate("2020-10-15T00:00:00Z"), $lte: ISODate("2020-10-31T23:59:59Z") } })

// Finding Company Drives and Students appeared:
db.getCollection(companydrivesCollection).aggregate([
    {
        $unwind: "$studentsAppeared"
    },
    {
        $lookup: {
            from: "users",
            localField: "studentsAppeared",
            foreignField: "name",
            as: "userDetails"
        }
    },
    {
        $addFields: {
            userDetailsCount: { $size: "$userDetails" }
        }
    },
    {
        $match: {
            userDetailsCount: { $gt: 0 }
        }
    },
    {
        $group: {
            _id: "$_id",
            company_name: { $first: "$company_name" },
            date: { $first: "$date" },
            studentsAppeared: { $push: "$studentsAppeared" },
            userDetails: { $first: "$userDetails" }
        }
    }
])


// Finding Problems Solved by a User:
db.getCollection(codekataCollection).findOne({ userId: 1 }, { problemSolved: 1 })
// db.getCollection(codekataCollection).find({}, { problemSolved: 1, userName: 1 });

// Finding Mentors with More Than 15 Mentees:
db.getCollection(mentorsCollection).find({
    $expr: {
        $gt: [{ $size: "$mentees" }, 15]
    }
})

// Finding Absent Users and Unsubmitted Tasks:
db.getCollection(attendanceCollection).find({
    $or: [
        { isPresent: false },
        { isTaskSubmitted: false }
    ]
})
