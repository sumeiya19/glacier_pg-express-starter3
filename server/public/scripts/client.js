// Display the list of existing songs on page load
getSongs();

// Get artist data from the server
function getSongs() {
    
    axios.get('/songs').then((response) => {
        console.log("GET /songs response", response);
        appendSongsToDom(response.data);
    });
}

function appendSongsToDom(songList) {
    let songsTableBody = document.querySelector("#songsTableBody")
    songsTableBody.innerHTML = '';
    // Loop over each song and append data to the DOM
    for (let song of songList) {
        songsTableBody.innerHTML += `
            <tr>
                <td>${song.artist}</td>
                <td>${song.track}</td>
                <td>
                    ${song.rank}
                    <button onClick="changeRank('up', ${song.id})">⬆️</button>
                    <button onClick="changeRank('down', ${song.id})">⬇️</button>
                </td>
                <td>${song.published}</td>
                <td>
                    <button onClick="deleteSong(${song.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }
}

function clearForm() {
    document.querySelector('#artist').value = '';
    document.querySelector('#track').value = '';
    document.querySelector('#rank').value = '';
    document.querySelector('#published').value = '';
}

function changeRank(direction, songId) {
    console.log("Changing song rank...", direction, " for song...", songId)

    // Use axios to send a PUT request to change song rank
        // Send direction & id in URL
    // For .then, will call the render function.    
    axios({
        // Sending both req.params & req.body in the same request.
        method: "PUT",
        url: "/songs/rank/" + songId,
        data: {
            direction: direction
        }
    })
    .then((response) => {
        // * getSongs() will retrieve all songs and then update the DOM
        getSongs()
    })
    .catch((error) => {
        console.log('Error', error);
        alert('Something went wrong on /songs/rank/:id');
    })
}

function postSong(event) {
    event.preventDefault();
    // Create our request body
    let payloadObject = {
        artist: document.querySelector('#artist').value,
        track: document.querySelector('#track').value,
        rank: document.querySelector('#rank').value,
        published: document.querySelector('#published').value,
    }
    // Send the new song to the server
    axios.post('/songs', payloadObject).then((response) => {
        clearForm();
        getSongs();
    }).catch((error) => {
        console.log('Error', error);
        alert('Something went wrong');
    });
}

// Remove a song from our list
function deleteSong(songId) {
    axios({
        method: "DELETE",
        url: `/songs/${songId}`
    })
    .then((response) => {
        getSongs();
    }).catch((error) => {
        console.log('Error', error);
        alert('Something went wrong');
    });
}