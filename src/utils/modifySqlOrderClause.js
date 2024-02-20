export const ModifySqlOrderClause = (inputSql) => {
  // const inputSql =
  //   "SELECT Lead_Id__c, toLabel(Constitution__c), FirstName, LastName, Company, toLabel(Status), CreatedDate, toLabel(Disposition_Status__c), Owner_Name__c, Id, RecordTypeId, LastModifiedDate, SystemModstamp FROM Lead WHERE IsConverted = false AND Disposition_Status__c = 'New' ORDER BY LastModifiedDate DESC Lead_Id__c ASC NULLS FIRST, Id ASC NULLS FIRST";

  // Find the index of the "ORDER BY" clause
  const orderByIndex = inputSql.indexOf('ORDER BY');

  // If "ORDER BY" clause is found, remove it
  let modifiedSql =
    orderByIndex !== -1 ? inputSql.slice(0, orderByIndex) : inputSql;

  // Append the new "ORDER BY" clause
  const newOrderByClause =
    'ORDER BY CreatedDate DESC NULLS FIRST, Id ASC NULLS FIRST';
  modifiedSql = modifiedSql + ' ' + newOrderByClause;

  //   console.log(modifiedSql);
  return modifiedSql;
};
