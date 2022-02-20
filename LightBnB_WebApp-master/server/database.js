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
const getUserWithEmail = (email) => {
  return pool
  .query(`
    SELECT *
    FROM users
    WHERE email = $1
    `, [email])
  .then((result) => result.rows[0])
  .catch((err) => {
    console.log(err.message);
  })
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  return pool
    .query(`
    SELECT * 
    FROM users
    WHERE users.id = $1`, [id])
    .then((result) => result.rows[0])
    .catch((err) => console.log(err.message));
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = ({name, email, password}) => {
  return pool
    .query(`INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3) `,  [name, email, password])
    .then((result) => result.rows)
    .catch((err) => console.log(err.message));
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = (guest_id) => {
  return pool
    .query(`
      SELECT * 
      FROM reservations
      WHERE guest_id = $1 AND DATE(start_date) <> DATE(NOW())`, [guest_id])
    .then((result) => result.rows )
    .catch((err) => console.log(err.message));
};
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
    .query(`
    SELECT * 
    FROM properties LIMIT $1`, [limit])
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

const addProperty = function(property) {
  return pool
    .query(`INSERT INTO properties(owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15), [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.country, property.street, property.city, property.province, property.post_code, 't'] 
    RETURNING *`)
    .then((result) => result.rows)
    .catch((err) => console.log(err.message));
}
exports.addProperty = addProperty;
