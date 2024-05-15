const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js')


router.get('/', (req, res) => {

    // Query text to send to the database (SELECT)
        // Using backticks will be easier since queries often have quotes in them
        // Needs to be the exact SQL that you would write in Postico
    let queryText = `SELECT * FROM "songs";`
    
    // Use pool to make the transaction with the DB
    pool.query(queryText)
        .then((result) => {
            console.log("Result from DB:", result.rows)
            res.send(result.rows)
        })
        .catch((err) => {
            console.log(`Error making query.. '${queryText}'`, err)
            res.sendStatus(500)
        })
});

// Get a song from the DB, by ID
    // The url itself will be used to hold some small bit of data. (param)
router.get('/getSongById/:id', (req, res) => {

    // ! Access param from the url & store in variable
    const incId = req.params.id
    console.log("Incoming Id: ", incId)

    let queryText = `
        SELECT * FROM "songs"
        WHERE "id" = $1;
    `

    // ! Make parameters into array
    let idToFind = [incId]

    pool.query(queryText, idToFind)
        .then((result) => {
            console.log("Result rows from DB", result.rows)
            res.send(result.rows)
        })
        .catch((err) => {
            console.log(`Error making query.. '${queryText}'`, err)
            res.sendStatus(500)
        })
})

router.post('/', (req, res) => {
    console.log('req.body', req.body);

    let song = req.body

    // Query Text...

    // ! Dont do the following (interpolation)
    // let queryText = `
    //     INSERT INTO "songs" ("artist", "track",  "published", "rank")
    //     VALUES ('${song.artist}', '${song.track}', '${song.published}', ${song.rank}, );
    // `

    // ! Use parameterization ✅

    let songArray = [song.rank, song.track, song.artist, song.published]
    let queryText = `
        INSERT INTO "songs" ("rank", "track", "artist", "published")
        VALUES ($1, $2, $3, $4);
    `

    // Use the pool to make the transaction
        // pool.query(queryText, [SOME ARRAY OF PARAMETERS])
    pool.query(queryText, songArray)
        .then((result) => {
            res.sendStatus(201)
        })
        .catch((err) => {
            console.log(`Error making query.. '${queryText}'`, err)
            res.sendStatus(500)
        })
});

router.delete('/:id', (req, res) => {
    // NOTE: This route is incomplete.
    console.log('req.params', req.params);

    let queryText = `
        DELETE FROM "songs" WHERE "id" = $1;
    `

    let reqId = [req.params.id]

    pool.query(queryText, reqId)
        .then((result) => {
            console.log("Successfully Deleted...")
            res.sendStatus(200)
        })
        .catch((err) => {
            console.log(`Error making query.. '${queryText}'`, err)
            res.sendStatus(500)
        })
});

router.put('/rank/:id', (req, res) => {
    let songId = req.params.id
    let direction = req.body.direction

    let queryText = ''

    console.log("Chang rank of song id: ", songId, " in direction: ", direction)
    if (direction === 'up') {
        queryText = `
            UPDATE "songs" SET "rank"="rank"-1
            WHERE "id"= $1;
        `
    } else if (direction === 'down') {
        queryText = `
            UPDATE "songs" SET "rank"="rank"+1
            WHERE "id"= $1;
        `
    } else {
        // ! If neither direction is provided, will respond with an error
        res.sendStatus(500)
        console.log("Direction should be 'up' or 'down'")
    }

    pool.query(queryText, [songId])
        .then((result) => {
            res.sendStatus(204)
        })
        .catch((err) => {
            console.log(`Error making query.. '${queryText}'`, err)
            res.sendStatus(500)
        })
})

module.exports = router;