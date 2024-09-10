const fs = require('fs')

const secrets = JSON.parse(fs.readFileSync('./secrets.json'))

const myHeaders = new Headers()
myHeaders.append("Authorization", `bearer ${secrets.token}`)
myHeaders.append("Accept", "application/json")
myHeaders.append("Content-Type", "application/json")

const graphql = JSON.stringify({
  query: `query
  {
      reportSchedules
      (
          where:
          {
              reportScheduleTypeId:
              {
                      in:[1,2]
              }
          }
      )
      {
          ScheduleTypeId : reportScheduleTypeId
          ReportScheduleId : id
          Cutoff : cutoffDate 
          ContractId : OG_Proj_ContractId
          ProjectName : OG_Proj_ProjectName
          Description : description
      }
  }`,
  variables: {}
})
const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: graphql,
  redirect: "follow"
}

fetch(
    "https://app-ilapanalytics-api-equinor-prod.azurewebsites.net/graphql/",
    requestOptions
)
  .then((response) => response.text())
  .then((result) =>
    {
        fs.writeFileSync(
            './ReportSchedules.json',
            JSON.stringify(JSON.parse(result), null, 4)
        )
        console.log('ಠ_ಠ')
    })
  .catch((error) => console.error(error))
