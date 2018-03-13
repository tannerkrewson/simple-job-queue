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

* **URL:** `/job`

* **Method:** `POST`

* **Data Params**
	* `url`: string with a HTTP/HTTPS URL

* **Success Response:**
	* `201 Created`
		* **Content:** `{"id":13,"url":"http://google.com/"}`

* **Error Response:**
	* `400 Bad Request`: Bad URL
	* `500 Internal Server Error`: Failed to add to database

### Check job status
Given a valid job id, returns the status, and if the job was successful, its
results.

* **Job Status Codes**
	* `0`: Job not completed, still in queue
	* `1`: Job was successful, results present in request
	* `-1`: Job failed

* **URL:** `/job`

* **Method:** `GET`

* **URL Params**
	* `?id=[integer]`: id of a job

* **Success Response:**
	* `200 OK`
		* **Content:** `{"id":13,"status":1,"url":"http://google.com/","result":"<HTML>...</HTML>"}`

* **Error Response:**
	* `404 Not Found`: Invalid job id

## Implementation
An [async](https://github.com/caolan/async) queue is used in
`/controllers/queue.js`. Not only does it queue up fetches, but it also queues
any interaction with the database.

If this project were to be developed further, here are a few things I would
want to add:
* Abstract database credentials into a config file or NODE_ENV.
* Secure from MySQL injections
* More informative job status codes
* Store the queue in the database itself in case the server crashes
* Store job result in a separate table
* Add tests for internal functions, as well as the external API itself
* Use a different kind of id for jobs
