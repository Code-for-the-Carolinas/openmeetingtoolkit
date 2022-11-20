mapboxgl.accessToken = 'pk.eyJ1IjoiY2N0aGVncmVhdCIsImEiOiJjbDI2a2lodnYwMnRnM2ZvdXVhZXNjbHd0In0.4CfhKr_VP1IDEM08Nk7PXg';

const stateCooridinates = [-79.0193, 35.7596 ];
const defaultCooridinates = [-79.8, 35.3];
const defaultZoom = 5;
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

const clearDiv = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

// Groups meetings by county then sorts A-Z
const groupMeetingsByCounty = (meetings) => {
    // For each meeting in the meeting list,
    return meetings.reduce((meetingsByCounty, item) => {
        // get the county the meeting is in,
        const county = item.properties.government;
        // if county is not blank,
        if (county) {
            // check if it's in our new list,
            if (meetingsByCounty[county]) {
                // add the meeting to the county,
                meetingsByCounty[county].push({properties: {...item.properties}, geometry: {...item.geometry}});
            } else {
                // otherwise add a new entry for the county.
                meetingsByCounty[county] = [{properties: {...item.properties}, geometry: {...item.geometry}}];
            }
        }
        // Return a nice sorted object!
        return meetingsByCounty;
    }, []);
};

// TODO: Implement function to show meeting when clicked
const showMeetings = (meetings) => {
    // const {id} = event.target;
    console.log(meetings);
    // list meetings
    clearDiv(document.querySelector('#listings'));
    let meetingList = document.getElementById('listings');
    // clearDiv(meetingList);

    const backButton = document.createElement('button');
    backButton.innerHTML = 'BACK'
    meetingList.appendChild(backButton)

    backButton.onclick = (event) => {
        event.preventDefault();
        flyToMeeting(defaultCooridinates, defaultZoom);
        showMeetingsByCounties(meetingsData);
    };

    for (let meeting of meetings) {
        const meetingButton = document.createElement('button');
        meetingButton.className = 'meeting-btn';
        meetingButton.id = `${meeting.properties.id}`;
        meetingButton.innerHTML = `${meeting.properties.publicbody}`;
        meetingButton.onclick = (event) => {
            event.preventDefault();
            flyToMeeting(meeting.geometry.coordinates, 10);
            showMeetingInfo(meeting);
        };
        meetingList.appendChild(meetingButton)
    }
};

// Adds a list of meetings to the DOM.
const showMeetingsByCounties = (meetingList) => {
    // console.log('meetings by county', meetingList)
    map.fire('closeAllPopups');
    flyToMeeting(stateCooridinates, 7);
    clearDiv(document.querySelector('#listings'));
    const countiesDiv = document.querySelector('#listings');

    const meetingsByCountyList = groupMeetingsByCounty(meetingList);
    console.log('meetings by county', meetingsByCountyList)

    // Create a list of county names sorted alphabetically.
    const countyNamesSorted = Object.keys(meetingsByCountyList).sort((c1, c2) => c1.localeCompare(c2));
    // For each county in list,
    for (const countyName of countyNamesSorted) {

        // render each county as a button for better accessablitiy(sp),
        const countyButton = document.createElement('button');
        countyButton.className = 'meeting-btn';
        countyButton.id = `${countyName}`;
        countyButton.textContent = `${countyName}`

        // add event to button to show meeting when clicked,
        countyButton.onclick = (event) => {
            event.preventDefault();
            showMeetings(meetingsByCountyList[countyName]);
        };
        countiesDiv.appendChild(countyButton);
    }
};

// Goes to meeting location on map.
const flyToMeeting = (meetingLocation, zoom) => {
    map.flyTo({
        center: meetingLocation,
        zoom: zoom,
    });
};

// Shows the meeting info as a popup in the map.
const showMeetingInfo = (meeting) => {
    const {address, county, location, publicbody, start, end, remote, schedule} = meeting.properties;
    // Check if there is a popup and remove it if so.
    removePopup();
    const popup = new mapboxgl.Popup({
            closeOnClick: false,
            anchor: 'center',
            maxWidth: '80%',
            focusAfterOpen: false
        })
        .setHTML(
            `<table class="meeting-info-table">
                <caption>${publicbody}</caption>
                <tr>
                <th>Government</th>
                <th>Public Body</th>
                <th>Location</th>
                </tr>
                <tr>
                <td>${county}</td>
                <td>${publicbody}</td>
                <td>${location}</td>
                </tr>
                <tr>
                <th>Address</th>
                <th>Schedule</th>
                <th>Start Time</th>
                </tr>
                <tr>
                <td>${address}</td>
                <td>${schedule}</td>
                <td>${start}</td>
                </tr>
                <tr>
                <th>End Time</th>
                <th>Remote Options</th>
                </tr>
                <tr>
                <td>${end}</td>
                <td>${remote}</td>
                </table>
            </div>`)
        .setLngLat(meeting.geometry.coordinates)
        .addTo(map);
};

const removePopup = () => {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) {
        popUps[0].remove();
    }
}

// __Map functions__
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
                meetingsData.push(meetingGeoJson);
            }
            return meetingsData;
        })
        .then((meetings) => {
            // console.log('load', meetings)
            map.addSource('meetingPlaces', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': meetings,
                }
            });
            // const meetingsByCountyList = groupMeetingsByCounty(meetings);
            // console.log(meetingsByCountyList);
            showMeetingsByCounties(meetings);
        })
        .catch((error) => (console.log('map load error', error)));

});

// Add event listener to the map to close all popups.
// You can trigger this by using map.fire('closeAllPopups);
map.on('closeAllPopups', () => {
    removePopup();
});


// Add zoom and navigation controls to map interface.
map.addControl(new mapboxgl.NavigationControl());
