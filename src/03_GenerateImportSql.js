
const fs = require('fs')

const inputFolderPath = './input/'
const outputFolderPath = './output/'

const inputFileNames = fs.readdirSync(inputFolderPath)

for(const inputFileName of inputFileNames)
{
    const outputFileName = inputFileName.split('.')[0]+'.sql'

    const jsonText = fs.readFileSync(inputFolderPath+inputFileName)

    let sqlText = `declare @jsonData nvarchar(max) = '${jsonText.toString().replace(/'/g, "''")}'`
    sqlText += `

insert into atbl_PC_ProjBaseline_Exp_ILAPMhrs(
    ScheduleTypeId,
    ReportScheduleId,
    Cutoff,
    ContractId,
    ProjectName,
    ProjectDescription,
    OriginatorCompany,
    ActId,
    ActCode,
    Cancelled,
    ActDescr,
    TotalQty,
    DiscCode,
    DiscDescr,
    PhaseCode,
    PhaseDescr,
    Plant,
    BuildBlockCode,
    BuildBlockDescr
)
select
    ScheduleTypeId = json_value(@JsonData, '$.data.reportScheduleByIdWithRevisions[0].ScheduleTypeId'),
    ReportScheduleId = json_value(@JsonData, '$.data.reportScheduleByIdWithRevisions[0].ReportScheduleId'),
    Cutoff = json_value(@JsonData, '$.data.reportScheduleByIdWithRevisions[0].Cutoff'),
    ContractId = json_value(@JsonData, '$.data.reportScheduleByIdWithRevisions[0].ContractId'),
    ProjectName = json_value(@JsonData, '$.data.reportScheduleByIdWithRevisions[0].ProjectName'),
    ProjectDescription = json_value(@JsonData, '$.data.reportScheduleByIdWithRevisions[0].ProjectDescription'),
    OriginatorCompany = json_value(@JsonData, '$.data.reportScheduleByIdWithRevisions[0].OriginatorCompany'),
    ActId = json_value(value, '$.ActId'),
    ActCode = json_value(value, '$.ActCode'),
    Cancelled = json_value(value, '$.Cancelled'),
    ActDescr = json_value(value, '$.ActDescr'),
    TotalQty = json_value(value, '$.TotalQty'),
    DiscCode = json_value(value, '$.DiscCode'),
    DiscDescr = json_value(value, '$.DiscDescr'),
    PhaseCode = json_value(value, '$.PhaseCode'),
    PhaseDescr = json_value(value, '$.PhaseDescr'),
    Plant = json_value(value, '$.Plant'),
    BuildBlockCode = json_value(value, '$.BuildingBlockCode'),
    BuildBlockDescr = json_value(value, '$.BuildingBlockDescr')
from
    openjson(@JsonData, '$.data.reportScheduleByIdWithRevisions[0].activities')
`

    fs.writeFileSync(outputFolderPath+outputFileName, sqlText)

}