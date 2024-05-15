// ! Require in the pg package
const pg = require('pg')

// ! Setup the pool (like a phone)
const pool = new pg.Pool({
    // * The Name of the database (NOT the table)
    database: 'music_library',
    // * The following two props will remain the same for local development
    host: 'localhost',
    port: 5432
})

module.exports = pool