<h2>School Management System API</h2>

<h6>This project is a Node.js and Express.js-based REST API to manage schools. It provides endpoints to add schools, list schools sorted by proximity to a given location, and add multiple schools in bulk. The project uses MySQL as the database.</h6>

<h3>Features</h3>
<h5>Add a School </h5>

Add a single school with details like name, address, latitude, and longitude.
<h5>List Schools by Proximity</h5>

Retrieve a list of schools sorted by their distance from a user-specified location.

<h3>Technologies Used</h3>
<b>Backend: Node.js, Express.js
Database: MySQL (with Aiven SQL string connection)
Other Libraries:
dotenv for environment variable management
mysql2/promise for database connection
cors for Cross-Origin Resource Sharing
body-parser for parsing JSON requests</b>

<h4>Endpoints</h4>
<b>1. Add a Single School</b>
Endpoint: /addSchool
Method: POST

<b>2. List Schools by Proximity</b>
Endpoint: /listSchools
Method: GET
Query Parameters:
latitude: User's latitude (required)
longitude: User's longitude (required)


