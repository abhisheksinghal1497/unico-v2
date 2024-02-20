export default function convertSqlToSoslFormat(sqlQuery) {
  // Extracting fields and conditions from the SQL query
  const fieldsRegex = /SELECT\s+(.*?)\s+FROM/;
  const conditionsRegex = /WHERE\s+(.*?)\s+ORDER\s+BY/;

  const fieldsMatch = sqlQuery.match(fieldsRegex);
  const conditionsMatch = sqlQuery.match(conditionsRegex);

  if (!fieldsMatch || !conditionsMatch) {
    return 'Invalid SQL query format';
  }

  const fields = fieldsMatch[1].split(',').map((field) => field.trim());
  const conditions = conditionsMatch[1].trim();

  // Constructing the JavaScript format string
  const javascriptString = `Lead(${fields.join(', ')} WHERE ${conditions})`;

  return javascriptString;
}
