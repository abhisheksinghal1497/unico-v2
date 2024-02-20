const GetEmployeeRole = (teamHierarchy) => {
  if (teamHierarchy && Object.keys(teamHierarchy)?.length > 0) {
    return teamHierarchy?.EmpRole__c;
  } else {
    return '';
  }
};

export default GetEmployeeRole;
