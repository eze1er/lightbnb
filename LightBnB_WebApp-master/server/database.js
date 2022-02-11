const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

const { Pool } = require('pg');
const { result } = require('lodash');
const res = require('express/lib/response');
 
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

// const getUserWithEmail = function(email) {

//   let user;
//   for (const userId in users) {
//     user = users[userId];
//     if (user.email.toLowerCase() === email.toLowerCase()) {
//       break;
//     } else {
//       user = null;
//     }
//   }
//   return Promise.resolve(user);
// }


const getUserWithEmail = (options, email) => {
  return pool
  .query(`SELECT * FROM users WHERE email LIKE ${process.argv[2]}`)
  .then((result) => result.toLowerCase())
  .catch((err) => {
    console.log(err.message);
  })
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (options, id) => {
  pool
    .query(`SELECT * FROM users $1
       WHERE users.id LIKE ${process.argv[2]}`)
    .then((result) => result)
    .catch((err) => console.log(err.message));
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = ({name, password, email}) => {
  console.log(`+++++++++++++`, name, password, email);
  return pool
    .query(`INSERT INTO users (name, password, email)
    VALUES ($1, $2, $3) `,  [name, password, email])
    .then((result) => result)
    .catch((err) => console.log(err.message))
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = (options, user) => {
  pool
    .query(`SELECT * FROM reservations $1
    WHERE user_id = ${process.argv[2]}`)
    .then((result) => result )
    .catch((err) => console.log(err.message));
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = (options, limit = 10) => {
  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => result.rows)
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
// const addProperty = function(property) {
//   const propertyId = Object.keys(properties).length + 1;
//   property.id = propertyId;
//   properties[propertyId] = property;
//   return Promise.resolve(property);
// }
const addProperty = function(options, property) {
  pool
    .query(`INSERT INTO properties (owner_id, title, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
    VALUES ($)`)
    .THEN((result) => result)
    .catch((err) => console.log(err.message));
}
exports.addProperty = addProperty;
