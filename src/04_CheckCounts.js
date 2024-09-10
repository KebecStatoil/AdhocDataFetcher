
const fs = require('fs')

const inputFolderPath = './input/'
const outputFolderPath = './output/'

const inputFileNames = fs.readdirSync(inputFolderPath)

const activityCounts = inputFileNames.map((inputFileName) =>
{
    const activityReport = JSON.parse(fs.readFileSync(inputFolderPath+inputFileName))

    return {
        ReportScheduleId: activityReport.data.reportScheduleByIdWithRevisions[0].ReportScheduleId,
        ProjectName: activityReport.data.reportScheduleByIdWithRevisions[0].ProjectName,
        ProjectDescription: activityReport.data.reportScheduleByIdWithRevisions[0].ProjectDescription,
        ActivityCount: activityReport.data.reportScheduleByIdWithRevisions[0].activities.length
    }
})

console.log(`${activityCounts.map(d => + d.ActivityCount).reduce((a,b) => a + b)} activities in total`)
console.table(activityCounts)