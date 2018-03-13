# simple-job-queue

## Install
1. Run MySQL on the default port (3306) with the following properties:
```
host     : 'localhost'
user     : 'root'
password : 'password'
// If you need to use a different user, change the settings in /controllers/queue.js.
```
2. Run the following commands to prep the database:
```
CREATE DATABASE `simple-job-queue`;
CREATE TABLE `jobs` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `status` tinyint(4) DEFAULT NULL,
  `url` text,
  `result` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
);
```
3. Run this command: `npm install`.
4. Finally, to start the server, run: `npm start`.

## Usage
Go to `localhost:3000` to use an HTML interface to interact with the API.

### Queue new job
Given a URL, creates a new job to fetch its content. Returns the id of the job.

* **URL**
`/job`

* **Method:**
`POST`

* **Data Params**
`url`: string with a HTTP/HTTPS URL

* **Success Response:**

* **Code:** 201 Created<br />
  **Content:** `{"id":13,"url":"http://google.com/"}`

* **Error Response:**

* **Code:** `400 Bad Request`: Bad URL
* **Code:** `500 Internal Server Error`: Failed to add to database

### Check job status
Given a valid job id, returns the status, and if the job was successful, its
results.

* **Job Status Codes**
* `0`: Job not completed, still in queue
* `1`: Job was successful, results present in request
* `-1`: Job failed

* **URL**
`/job/:id`

* **Method:**
`GET`

* **URL Params**
`id`: id of a job

* **Success Response:**

* **Code:** 200 OK<br />
  **Content:** `{"id":13,"status":1,"url":"http://google.com/","result":"<HTML>...</HTML>"}`

* **Error Response:**

* **Code:** `404 Not Found`: Invalid job id
