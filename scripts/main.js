mapboxgl.accessToken = 'pk.eyJ1IjoiY2N0aGVncmVhdCIsImEiOiJjbDI2a2lodnYwMnRnM2ZvdXVhZXNjbHd0In0.4CfhKr_VP1IDEM08Nk7PXg';
const defaultCooridinates = [-79.8, 35.3]
const defaultZoom = 7
const spreadSheetID = '12GiMtxkEZA-TzAB0iBf3S_euXBId7HaPlWUvpOf9p-Q';
const sheetName = 'all';
const sheetURI = `https://docs.google.com/spreadsheets/d/${spreadSheetID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

const meetingsSheetData = [];
const meetingsJsonData = {};
const meetingsData = [];

// __Data Fetching Functions__
const handleFetchErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
};

const getMeetingGoogleSheetData = () => {
    // return fetch(sheetURI)
    return fetch('assets/meetings.csv')
        .then(handleFetchErrors) // This will handle network status errors.
        .then((response) => (response.text())) // Return response as text string.
        .then((data) => {
            return data;
        })
        .catch((error) => (console.log('fetching gsheet error', error))); // This will handle any other errors.
};

const getMeetingJsonData = () => {
    return fetch('assets/meetings.json')
        .then(handleFetchErrors) // This will handle network status errors.
        .then((response) => (response.json())) // Parse response into object.
        .then((data) => (data)) // Return the data.
        .catch((error) => (console.log('fetching json error', error))) // This will handle any other errors.
};

const getMeetingData = () => {
    // Need to fetch the Google Sheet data.
    // return getMeetingGoogleSheetData()
    //     .then((data) => {
    //         const parsedData = d3.csvParse(data);
    //         // Then add it to the
    //         return parsedData;
    //     })
    //     .catch((error) => (console.log('Error getting meeting data', error)));

    // return fetch()
};

function groupMeetingsByLocation(meetings) {
    const meetingList = {}

    for(let i = 0; i < meetings.length; i++) {
        // construct key using lat and long to group by
        const coords = meetings[i].geometry.coordinates
        const coordsKey = coords.toString()

        if (meetingList[coordsKey]) {
            meetingList[coordsKey].push(meetings[i])
        } else {
            meetingList[coordsKey] = new Array(meetings[i])
        }
    }
    return meetingList
}

// __Map functions__
const addMarkers = (meetings) => {
    const groupedMeetings = groupMeetingsByLocation(meetings)
    /* For each feature in the GeoJSON object above: */

    for (const meeting in groupedMeetings) {
        const marker = groupedMeetings[meeting]
        /* Add a group of meetings marker to map*/
        if (marker.length > 1) {
            addGroupMarker(marker)
        } else {

        /* Create a div element for the marker. */
        const el = document.createElement('div');
        /* Assign a unique `id` to the marker. */
        el.id = `marker-${marker[0].properties.Id}`;
        /* Assign the `marker` class to each marker for styling. */
        el.className = 'marker';

        /**
         * Create a marker using the div element
         * defined above and add it to the map.
         **/
        new mapboxgl.Marker(el, { offset: [0, -23] })
            .setLngLat(marker[0].geometry.coordinates)
            .addTo(map);

        /**
         * Listen to the element and when it is clicked, do three things:
         * 1. Fly to the point
         * 2. Close all other popups and display popup for clicked meeting
         * 3. Highlight listing in sidebar (and remove highlight for all other listings)
         **/
        el.addEventListener('click', (e) => {
            /* Fly to the point */

            flytoMeeting(marker[0].geometry.coordinates, 14);

            /* Close all other popups and display popup for clicked meeting */
            createPopUp(marker[0]);
            /* Highlight listing in sidebar */
            const activeItem = document.getElementsByClassName('active');
            e.stopPropagation();
            if (activeItem[0]) {
                activeItem[0].classList.remove('active');
            }
            const listing = document.getElementById(
                `listing-${marker[0].properties.id}`
            );
            listing.classList.add('active');
        });
    }
}
}

function addGroupMarker(arrOfMeetings) {
    const locationKey = (arrOfMeetings[0].geometry.coordinates).toString()
    const el = document.createElement('div');
    el.id = `marker-${locationKey}`
    el.className = 'marker'

    new mapboxgl.Marker(el, { offset: [0, -23] })
        .setLngLat(arrOfMeetings[0].geometry.coordinates)
        .addTo(map);


    el.addEventListener('click', e => {
        flytoMeeting(arrOfMeetings[0].geometry.coordinates, 14)
        createGroupPopUp(arrOfMeetings)

    }, false)

}

// Clear the map of markers and zoom back out
function removeAllMarkers() {
    const markers = document.querySelectorAll('.marker')
    const popup = document.querySelector('.mapboxgl-popup')
    if(popup) popup.remove()
    for(const marker of markers) {
        marker.remove()
    }
    flytoMeeting();
}

function backButton(showElem, parentElem, removeEle) {
    const listings = document.querySelector(parentElem)
    const backButton = listings.appendChild(document.createElement('div'))
    backButton.className = 'item'

    /* Make the back button a link for accessibility */
    const link = backButton.appendChild(document.createElement('a'))
    link.href = '#'
    link.className = 'title'
    link.id = 'Back'
    link.innerText = '< Back to Counties'

    backButton.addEventListener('click', () => {
        document.querySelector(showElem).style.display = 'block'
        removeAllMarkers();
        const collection = listings.querySelectorAll(removeEle)
        for (const elem of collection) {
            elem.parentNode.removeChild(elem)
        }
    })
}

// Add a listing for each meeting to the sidebar.
function buildLocationList(meetings) {
    /* Add back button to top of list to nav back to counties */
    backButton('#counties', '#listings', '.item')

    /* Continue to add meeting listings */
    for (const meeting of (meetings)) {
        const publicBody = meeting.properties.Public_body || meeting.properties.publicbody
        const id = meeting.properties.Id || meeting.properties.id
        const location = meeting.properties.Location || meeting.properties.location

        /* Add a new listing section to the sidebar. */
        const listings = document.getElementById('listings');
        const listing = listings.appendChild(document.createElement('div'));
        /* Assign a unique `id` to the listing. */
        listing.id = `listing-${id}`;
        /* Assign the `item` class to each listing for styling. */
        listing.className = 'item';

        /* Add the link to the individual listing created above. */
        const link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.id = `link-${id}`;
        link.innerHTML = `${publicBody}`;

        /* Add details to the individual listing. */
        const details = listing.appendChild(document.createElement('div'));
        details.innerHTML = `${location}`;
        if (meeting.properties.phone) {
            details.innerHTML += ` &middot; ${meeting.properties.phoneFormatted}`;
        }

        /**
         * Listen to the element and when it is clicked, do four things:
         * 1. Update the `currentFeature` to the meeting associated with the clicked link
         * 2. Fly to the point
         * 3. Close all other popups and display popup for clicked meeting
         * 4. Highlight listing in sidebar (and remove highlight for all other listings)
         **/
        // TODO: use event delgation to create event listeners
        link.addEventListener('click', function () {

            for (const feature of meetings) {
                const featId = feature.properties.Id || feature.properties.id
                if (this.id === `link-${featId}`) {
                    flytoMeeting(feature.geometry.coordinates, 15);

                    createPopUp(feature);
                }
            }
            const activeItem = document.getElementsByClassName('active');
            if (activeItem[0]) {
                activeItem[0].classList.remove('active');
            }
            this.parentNode.classList.add('active');
        });
    }
}

// Use Mapbox GL JS's `flyTo` to move the camera smoothly
// a given center point.
function flytoMeeting(currentFeature) {
    console.log(currentFeature)
    map.flyTo({
        center: currentFeature,
        zoom: 15
    });
}

// Create a Mapbox GL JS `Popup`.
function createPopUp(currentFeature) {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML(
            `<h3><center>${currentFeature.properties.publicbody}</center></h3>
                        <h4>
                        <table>
                        <tr>
                        <th><center>Government</center></th>
                        <th><center>Public Body</center></th>
                        <th><center>Location</center></th>
                        </tr>
                        <tr>
                        <td><center>${currentFeature.properties.government}</center></td>
                        <td><center>${currentFeature.properties.publicbody}</center></td>
                        <td><center>${currentFeature.properties.location}</center></td>
                        </tr>
                        <tr>
                        <th><center>Address</center></th>
                        <th><center>Schedule</center></th>
                        <th><center>Start Time</center></th>
                        </tr>
                        <tr>
                        <td><center>${currentFeature.properties.address}</center></td>
                        <td><center>${currentFeature.properties.schedule}</center></td>
                        <td><center>${currentFeature.properties.start}</center></td>
                        </tr>
                        <tr>
                        <th><center>End Time</center></th>
                        <th><center>Remote Options</center></th>
                        </tr>
                        <tr>
                        <td><center>${currentFeature.properties.end}</center></td>
                        <td><center>${currentFeature.properties.remote}</center></td>
                        </h4>`
        )
        .addTo(map);
}

function createGroupPopUp(arrOfMeetings) {
    const html = `
            <div class='listings' id='meeting-location'>
                ${arrOfMeetings.map((meeting, idx) => `<div class='item'><a href="#" class='meeting-link title' id=${idx}>${meeting.properties.publicbody}</a></div>`).join("")}
            </div>
            `;

    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(arrOfMeetings[0].geometry.coordinates)
        .setHTML(
            `<h3><center>Meetings at this location</center></h3>
                        ${html}`
        )
        .addTo(map);

    const meetingsAtLocation = document.querySelector('#meeting-location')

    meetingsAtLocation.addEventListener('click', e => {
        if(!e.target.matches('.meeting-link')) return
        e.preventDefault()
        popUps[0].remove()
        flytoMeeting(arrOfMeetings[e.target.id].geometry.coordinates, 14)
        createPopUp(arrOfMeetings[e.target.id])

    })
}

// Create new map instance inside the div with id 'map'.
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: defaultCooridinates,
    zoom: 5,
    scrollZoom: false
});

// After the initial html loads for the page,
// fetch the meeting data,
// add each entry to the map,
// then build list of meetings and add to page.
map.on('load', () => {

    // Then get the Google Sheet data.
    getMeetingGoogleSheetData()
        .then((data) => {
            // Parse the csv data into an object for easy access.
            const parsedData = d3.csvParse(data);
            return parsedData;
        })
        .then((data) => {
            // Format data for mapbox
            const geoJsonArray = [];
            for (let meeting of data) {
                let meetingGeoJson = {
                    "properties": {
                        "government": meeting.Government,
                        "publicbody": meeting.Public_body,
                        "location": meeting.Location,
                        "address": meeting.Address,
                        "schedule": meeting.Schedule,
                        "start": meeting.Start_time,
                        "end": meeting.End_time,
                        "remote": meeting.Remote_options,
                        "moreInfo": meeting.source,
                        "id": meeting.Id,
                      },
                      "geometry": {
                        "longitude": meeting.Longitude,
                        "latitude": meeting.Latitude,
                        "coordinates": [meeting.Longitude, meeting.Latitude],
                        "type": "Point"
                      },
                      "type": "Feature"
                };
                geoJsonArray.push(meetingGeoJson);
            }
            return geoJsonArray;
        })
        .then((meetings) => {
            console.log('load', meetings)
            map.addSource('meetingPlaces', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': meetings,
                }
            });
            // buildCountyList(meetings);
        })
        .catch((error) => (console.log('map load error', error)));

});

// Add zoom and navigation controls to map interface.
map.addControl(new mapboxgl.NavigationControl());
