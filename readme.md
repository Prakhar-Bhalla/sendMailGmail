// To run the code
write node .\src\server.js in terminal and press enter.

// To post request through postman
send a POST request on http://localhost:2356/sendmail with body in json form as follows:

{
“email”:”airiddha@tagmango.com”,
“Time”:”21st march,2022,6:00 AM”,
“Subject”:”particular time test email”,
“body”:”hey this is test email”
}

// valid Time formats in body
now, 1 hour later, 2 hours later, 21st march,2022,6:00 AM.
