mapboxgl.accessToken =
  'pk.eyJ1IjoiY2N0aGVncmVhdCIsImEiOiJjbDI2a2lodnYwMnRnM2ZvdXVhZXNjbHd0In0.4CfhKr_VP1IDEM08Nk7PXg';

// Nort Carolina
const defaultCooridinates = [-79.8, 35.3];
// Zoom level for state.
const defaultZoom = 7;
// Zoom level for all meetings in a county is set dynamically in showMeetingInfo()
// Zoom level for individual meetings.
const meetingInfoZoom = 19;

// Change this to the id of your Google Sheet!
// Your Google Sheet id can be taken from the url of the sheet.
// EX: https://docs.google.com/spreadsheets/d/[GOOGLE_SHEET_ID]/

const spreadSheetID = '1sUZeDFnevGbdjIOE8S1ddlLhDCizKf1XolTIM1JtROo';
const sheetName = 'all';
const sheetURI = `https://docs.google.com/spreadsheets/d/${spreadSheetID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

// Stores the meeting data as geojson objects.
const meetingsData = [];
let currentMeetings = [];

// __Data Fetching Functions__
const handleFetchErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

const getMeetingGoogleSheetData = () => {
  return fetch(sheetURI)
    .then(handleFetchErrors) // This will handle network status errors.
    .then((response) => response.text()) // Return response as text string.
    .then((data) => {
      return data;
    })
    .catch((error) => console.log('fetching gsheet error', error)); // This will handle any other errors.
};

// Helper function to clear all child elements from a parent div.
const clearDiv = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

const addBackButton = (backToView) => {
  // Remove it if it's there.
  removeBackButton();
  let backButton = document.createElement('button');
  backButton.innerHTML = 'BACK';
  backButton.setAttribute('id', 'back-button');

  backButton.onclick = (event) => {
    event.preventDefault();
    removeMarkers();
    flyToMeeting(defaultCooridinates, defaultZoom);
    if (backToView === 'counties') {
      showCounties(meetingsData);
    } else if (backToView === 'meetings') {
      showMeetings(currentMeetings);
    }
  };

  document.getElementById('listings-control').appendChild(backButton);
};

const removeBackButton = () => {
  if (document.getElementById('back-button')) {
    document.getElementById('back-button').remove();
  }
};

// __Map Listing Functions__

// Groups meetings by county then sorts A-Z
const groupMeetingsByCounty = (meetings) => {
  // For each meeting in the meeting list,
  return meetings.reduce((meetingsByCounty, item) => {
    // get the county the meeting is in,
    const government = item.properties.government;
    // if county is not blank,
    if (government) {
      // check if it's in our new list,
      if (meetingsByCounty[government]) {
        // add the meeting to the county,
        meetingsByCounty[government].push({
          properties: { ...item.properties },
          geometry: { ...item.geometry },
        });
      } else {
        // otherwise add a new entry for the county.
        meetingsByCounty[government] = [
          {
            properties: { ...item.properties },
            geometry: { ...item.geometry },
          },
        ];
      }
    }
    // Return a nice sorted object!
    return meetingsByCounty;
  }, []);
};

// Adds a list of meetings to the DOM.
const showCounties = (meetingList) => {
  // Remove the back button if it's there.
  removeBackButton();

  // Clear out #listings div.
  clearDiv(document.querySelector('#listings'));

  // Sort the meetings by county.
  const meetingsByCountyList = groupMeetingsByCounty(meetingList);

  // Create a list of county names sorted alphabetically.
  const countyNamesSorted = Object.keys(meetingsByCountyList).sort((c1, c2) =>
    c1.localeCompare(c2)
  );

  // For each county in list,
  // create and add a button for each county.
  for (const countyName of countyNamesSorted) {
    const countyButton = document.createElement('button');
    countyButton.className = 'meeting-btn';
    countyButton.id = `${countyName}`;
    countyButton.textContent = `${countyName}`;
    countyButton.onclick = (event) => {
      event.preventDefault();
      showMeetings(meetingsByCountyList[countyName]);
    };
    document.querySelector('#listings').appendChild(countyButton);
  }
};

// Shows the selected county's meetings in #listings div.
const showMeetings = (meetings) => {
  // Clear out the listings div.
  clearDiv(document.querySelector('#listings'));

  addBackButton('counties');
  currentMeetings = meetings;

  const meetingsByLocation = {};
  let hasRemoteMeeting = 0;

  for (let i in meetings) {
    const meetingCoordinates = meetings[i].geometry.coordinates.toString();
    if (meetingCoordinates != ',') {
      if (meetingsByLocation[meetingCoordinates]) {
        meetingsByLocation[meetingCoordinates].meetings.push(meetings[i]);
      } else {
        meetingsByLocation[meetingCoordinates] = {
          meetings: [meetings[i]],
        };
        if (meetings[i].properties.placeholder === '1') {
          meetingsByLocation[meetingCoordinates].hasRemoteMeeting = 1;
        } else {
          meetingsByLocation[meetingCoordinates].hasRemoteMeeting = 0;
        }
      }
    }
  }

  // Add all the meetings and keep track of the coordinates
  // to resize the map based on the number of markers created.

  for (let meeting of meetings) {
    const meetingButton = document.createElement('button');
    meetingButton.className = 'meeting-btn';
    meetingButton.id = `${meeting.properties.id}`;
    meetingButton.innerHTML = `${meeting.properties.publicbody}`;
    meetingButton.onclick = (event) => {
      event.preventDefault();
      flyToMeeting(meeting.geometry.coordinates);
      clearDiv(document.querySelector('#listings'));
      showMeetingInfo([meeting], meeting.geometry.coordinates);
    };
    // Add the markers to map.
    document.getElementById('listings').appendChild(meetingButton);

    // addMeetingMarker(meeting.geometry.coordinates, meeting, meetings);
  }
  addMeetingMarkers(meetingsByLocation, hasRemoteMeeting);

  const coordinates = [];
  for (let location in meetingsByLocation) {
    if (location !== ',') {
      coordinates.push(location.split(','));
    }
  }
  if (coordinates.length > 0) {
    const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]);

    for (const coord of coordinates) {
      bounds.extend(coord);
    }

    map.fitBounds(bounds, {
      padding: 40,
    });
  }
};

// Shows the meeting info in the #listings div.
const showMeetingInfo = (meeting, meetingCoordinates) => {
  let listingsDiv = document.getElementById('listings');

  flyToMeeting(meetingCoordinates, meetingInfoZoom);

  addBackButton('meetings');

  for (let i in meeting) {
    // Create the info and add to the DOM.
    const {
      publicbody,
      government,
      location,
      address,
      schedule,
      start,
      end,
      remote,
    } = meeting[i].properties;
    let meetingInfoDiv = document.createElement('div');
    meetingInfoDiv.className = 'meeting-info';
    meetingInfoDiv.innerHTML = `<p><b>Public Body:</b> ${publicbody}</p>
            <p><b>Government:</b> ${government}</p>
            <p><b>Address:</b> ${location} <br> ${address}</p>
            <p><b>Schedule:</b> ${schedule}</p>
            <p><b>Start:</b> ${start} <b>End: </b>${end}</p>
            <p><b>Remote:</b> ${remote}</p>`;
    listingsDiv.appendChild(meetingInfoDiv);
  }
};

// __MapBox Functions__

// Goes to meeting location on map.
const flyToMeeting = (meetingLocation, zoom) => {
  if (meetingLocation) {
    map.flyTo({
      center: meetingLocation,
      zoom: zoom,
    });
  }
};

// Adds map marker for a given set of coordinates
// const addMeetingMarker = (coordinates, meeting, meetings) => {
const addMeetingMarkers = (meetings) => {
  for (let meeting in meetings) {
    for (const location of meetings[meeting].meetings) {
      const markerCoordinates = meeting.split(',');

      const markerStyle =
        location.properties.placeholder === '0'
          ? {
              anchor: 'center',
              color: '#ffb446',
            }
          : {
              anchor: 'center',
              color: '#d5a6bd',
            };

      const marker = new mapboxgl.Marker(markerStyle)
        .setLngLat(markerCoordinates)
        .addTo(map);

      marker.getElement().addEventListener('click', () => {
        flyToMeeting(markerCoordinates, meetingInfoZoom);
        clearDiv(document.querySelector('#listings'));
        showMeetingInfo(meetings[meeting].meetings);
      });
    }
  }
};

const removeMarkers = () => {
  const markers = document.querySelectorAll('.mapboxgl-marker');
  for (let marker of markers) {
    marker.remove();
  }
};

// __Map functions__
// Create new map instance inside the div with id 'map'.
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: defaultCooridinates,
  zoom: 5,
  scrollZoom: false,
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
          properties: {
            id: meeting.Id,
            government: meeting.Government,
            publicbody: meeting.Public_body,
            location: meeting.Location,
            address: meeting.Address,
            schedule: meeting.Schedule,
            start: meeting.Start_time,
            end: meeting.End_time,
            remote: meeting.Remote_options,
            moreInfo: meeting.source,
            placeholder: meeting.Placeholder,
          },
          geometry: {
            longitude: meeting.Longitude,
            latitude: meeting.Latitude,
            coordinates: [meeting.Longitude, meeting.Latitude],
            type: 'Point',
          },
          type: 'Feature',
        };
        meetingsData.push(meetingGeoJson);
      }
      return meetingsData;
    })
    .then((meetings) => {
      map.addSource('meetingPlaces', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: meetings,
        },
      });
      showCounties(meetings);
      flyToMeeting(defaultCooridinates, defaultZoom);
    })
    .catch((error) => console.log('map load error', error));
});

// Add zoom and navigation controls to map interface.
map.addControl(new mapboxgl.NavigationControl());
