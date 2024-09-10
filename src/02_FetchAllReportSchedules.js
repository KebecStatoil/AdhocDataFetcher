const fs = require('fs')

const secrets = JSON.parse(fs.readFileSync('./secrets.json'))
const reportSchedules = JSON.parse(fs.readFileSync('./ReportSchedules.json'))

const namesAndIdsNoNulls = reportSchedules.data.reportSchedules
    .filter((rs) => !! (rs.ProjectName || rs.Description))
    .map(({ReportScheduleId, ProjectName, Description}) => ({
        id: ReportScheduleId,
        name: (ProjectName || Description) }))
        
///////////////////////////////////////////////////////////////////////////////

fetchAllReports(namesAndIdsNoNulls, secrets.token)
console.table(namesAndIdsNoNulls)

///////////////////////////////////////////////////////////////////////////////

async function fetchAllReports(reportEntries, token) {
    for (const reportEntry of reportEntries) {
            const { name, id } = reportEntry
            await fetchReportById(`input\\${name}.json`, id, token)
    }
    console.log('¯\\_(ツ)_/¯')
}

async function fetchReportById(filePath, id, token)
{
    const myHeaders = new Headers()
    myHeaders.append("Authorization", `bearer ${token}`)
    myHeaders.append("Accept", "application/json")
    myHeaders.append("Content-Type", "application/json")
    
    const graphql = JSON.stringify({
        query: `
            query ReportScheduleByIdWithRevisions($id: Int!)
            { 
                reportScheduleByIdWithRevisions(id:$id)
                { 
                    ScheduleTypeId : reportScheduleTypeId
                    ReportScheduleId : id
                    Cutoff : cutoffDate 
                    ContractId : OG_Proj_ContractId
                    ProjectName : OG_Proj_ProjectName
                    ProjectDescription : description
                    OriginatorCompany : OG_Proj_OriginatorCompany
                    activities
                    {
                        ActId : id
                        ActCode : code
                        Cancelled : isCancelled 
                        ActDescr : description
                        TotalQty : totalWorkHours
                        DiscCode : OG_Act_ContractorDiscCode
                        DiscDescr : OG_Act_ContractorDiscDescr
                        PhaseCode : OG_Act_ContractorPhaseCode
                        PhaseDescr : OG_Act_ContractorPhaseDescr
                        Plant: OG_Act_Plant
                        BuildingBlockCode: OG_Act_BuildingBlockCode
                        BuildingBlockDescr: OG_Act_BuildingBlockDescr
                    }
                }
            }
        `,
        variables: {"id":id}
    })
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: graphql,
      redirect: "follow"
    }
    
    await fetch("https://app-ilapanalytics-api-equinor-prod.azurewebsites.net/graphql/", requestOptions)
      .then((response) => response.text())
      .then((result) =>
        {
            fs.writeFileSync(
                filePath,
                JSON.stringify(JSON.parse(result), null, 4)
            )
            console.log(`${filePath} written.`)
        })
      .catch((error) => console.error(error))
}