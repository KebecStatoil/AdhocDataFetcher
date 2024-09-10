
select
	ProjectName,
	ProjectDescription,
	count(*) as Count
from
	dbo.atbl_PC_ProjBaseline_Exp_ILAPMhrs with (nolock)
group by
	ProjectName,
	ProjectDescription
order by
	ProjectName,
	ProjectDescription

-- select count(*) as Count from dbo.atbl_PC_ProjBaseline_Exp_ILAPMhrs with (nolock)

-- truncate table dbo.atbl_PC_ProjBaseline_Exp_ILAPMhrs