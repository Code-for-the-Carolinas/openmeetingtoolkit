mapboxgl.accessToken = 'pk.eyJ1IjoiY2N0aGVncmVhdCIsImEiOiJjbDI2a2lodnYwMnRnM2ZvdXVhZXNjbHd0In0.4CfhKr_VP1IDEM08Nk7PXg';

// Nort Carolina
const defaultCooridinates = [-79.8, 35.3];
const defaultZoom = 7;

// Change this to the id of your Google Sheet!
// const spreadSheetID = '12GiMtxkEZA-TzAB0iBf3S_euXBId7HaPlWUvpOf9p-Q';
const spreadSheetID = '1mUvNFfMyX3yrgo-b9fTsHk3rHPWLKJyzbwuRbSV2dDQ';

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
    return fetch(sheetURI)
    // return fetch('assets/meetings.csv')
        .then(handleFetchErrors) // This will handle network status errors.
        .then((response) => (response.text())) // Return response as text string.
        .then((data) => {
            return data;
        })
        .catch((error) => (console.log('fetching gsheet error', error))); // This will handle any other errors.
};

// Helper function to clear all child elements from a parent div.
const clearDiv = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

const createBackButton = (pageNumber) => {
    let backButton = document.createElement('button');
    backButton.innerHTML = 'BACK';
    backButton.className = 'back-button';
    backButton.onclick = (event) => {
        event.preventDefault();
        console.log(pageNumber)
        removeMarkers();
        flyToMeeting(defaultCooridinates, defaultZoom);
        showCounties(meetingsData);
    };
    return backButton;
};




// __Map Listing Functions__
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

// Adds a list of meetings to the DOM.
const showCounties = (meetingList) => {
    // map.fire('closeAllPopups');

    clearDiv(document.querySelector('#listings'));
    const countiesDiv = document.querySelector('#listings');

    const meetingsByCountyList = groupMeetingsByCounty(meetingList);

    // Create a list of county names sorted alphabetically.
    const countyNamesSorted = Object.keys(meetingsByCountyList).sort((c1, c2) => c1.localeCompare(c2));
    // For each county in list,
    for (const countyName of countyNamesSorted) {

        // render each county as a button for better accessablitiy(sp),
        const countyButton = document.createElement('button');
        countyButton.className = 'meeting-btn';
        countyButton.id = `${countyName}`;
        countyButton.textContent = `${countyName}`;
        // add event to button to show meeting when clicked,
        countyButton.onclick = (event) => {
            event.preventDefault();
            showMeetings(meetingsByCountyList[countyName]);
        };
        countiesDiv.appendChild(countyButton);
    }
};

// TODO: Implement function to show meeting when clicked
const showMeetings = (meetings) => {

    clearDiv(document.querySelector('#listings'));
    let meetingList = document.getElementById('listings');

    // backButton.className = 'back-button';

    let backButton = document.createElement('button');
    backButton.innerHTML = 'BACK';
    backButton.id = 'back-button';
    backButton.onclick = (event) => {
        event.preventDefault();
        removeMarkers();
        flyToMeeting(defaultCooridinates, defaultZoom);
        showCounties(meetingsData);
    };

    meetingList.appendChild(backButton);


    const coordinates = [];
    for (let meeting of meetings) {
        const meetingButton = document.createElement('button');
        meetingButton.className = 'meeting-btn';
        meetingButton.id = `${meeting.properties.id}`;
        meetingButton.innerHTML = `${meeting.properties.publicbody}`;
        meetingButton.onclick = (event) => {
            event.preventDefault();
            flyToMeeting(meeting.geometry.coordinates, 10);
            showMeetingInfo(meeting, meetings);
        };
        // Add the markers to map.
        meetingList.appendChild(meetingButton);
        addMeetingMarker(meeting.geometry.coordinates, meeting);
        coordinates.push(meeting.geometry.coordinates);
    }
    const bounds = new mapboxgl.LngLatBounds(
        coordinates[0],
        coordinates[0]
    );

    // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
    for (const coord of coordinates) {
        bounds.extend(coord);
    }

    map.fitBounds(bounds, {
        padding: 40
    });
};



// Shows the meeting info as a popup in the map.
const showMeetingInfo = (meeting, meetings) => {
    // Check if there is a popup and remove it if so.
    removePopup();
    clearDiv(document.querySelector('#listings'));

    let listingsDiv = document.getElementById('listings');

    const {publicbody, government, location, address, schedule, start, end, remote} = meeting.properties;
    flyToMeeting(meeting.geometry.coordinates, 7);

    // document.getElementById('back-button').remove();

    // let backButton = document.createElement('button');
    // backButton.innerHTML = 'BACK';
    // backButton.id = 'back-button';

    backButton = document.getElementById('back-button');
    backButton.onclick = (event) => {
        event.preventDefault();
        removeMarkers();
        console.log('test')
        // flyToMeeting(defaultCooridinates, defaultZoom);
        // showMeetings(meetings);
    };

    // listingsDiv.appendChild(backButton);



    let meetingInfoDiv = document.createElement('div');
    meetingInfoDiv.className = 'meeting-info';
    meetingInfoDiv.innerHTML =
        `<p><b>Public Body:</b> ${publicbody}</p>
        <p><b>Government:</b> ${government}</p>
        <p><b>Address:</b> ${location} <br> ${address}</p>
        <p><b>Schedule:</b> ${schedule}</p>
        <p><b>Start:</b> ${start} <b>End: </b>${end}</p>
        <p><b>Remote:</b> ${remote}</p>`;

    listingsDiv.appendChild(meetingInfoDiv);

    // const popup = new mapboxgl.Popup({
    //         closeOnClick: false,
    //         anchor: 'center',
    //         maxWidth: '80%',
    //         focusAfterOpen: false
    //     })
    //     .setHTML(
    //         `<div class="meeting-info">
    //             <p><b>Public Body:</b> ${publicbody}</p>
    //             <p><b>Government:</b> ${government}</p>
    //             <p><b>Address:</b> ${location} <br> ${address}</p>
    //             <p><b>Schedule:</b> ${schedule}</p>
    //             <p><b>Start:</b> ${start} <b>End: </b>${end}</p>
    //             <p><b>Remote:</b> ${remote}</p>
    //         </div>`
    //     )
    //     .setLngLat(meeting.geometry.coordinates)
    //     .addTo(map);
};


// __MapBox Functions__
// Goes to meeting location on map.
const flyToMeeting = (meetingLocation, zoom) => {
    map.flyTo({
        center: meetingLocation,
        zoom: zoom,
    });
};

// Removes all popups from map.
const removePopup = () => {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) {
        popUps[0].remove();
    }
}

// Adds map marker for a given set of coordinates
const addMeetingMarker = (coordinates, meeting) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'meeting-marker';
    markerElement.onclick = () => {
        flyToMeeting(coordinates, 7);
        showMeetingInfo(meeting);
    }
    const marker = new mapboxgl.Marker({
        'anchor': 'center',
        'element': markerElement,
    })
    .setLngLat(coordinates)
    .addTo(map);
}

const removeMarkers = () => {
    const markers = document.querySelectorAll('.mapboxgl-marker')
    for(let marker of markers) {
        marker.remove();
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
            showCounties(meetings);
            flyToMeeting(defaultCooridinates, defaultZoom);
            // showMeetingInfo(meetings[0]);
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
