
-- getUserWithEmail
-- Accepts an email address and will return a promise.
-- The promise should resolve with the user that has that email address, or null if that user does not exist.

SELECT * 
FROM users
WHERE email LIKE `${process.argv[2]};


