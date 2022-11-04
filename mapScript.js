mapboxgl.accessToken = 'pk.eyJ1IjoiY2N0aGVncmVhdCIsImEiOiJjbDI2a2lodnYwMnRnM2ZvdXVhZXNjbHd0In0.4CfhKr_VP1IDEM08Nk7PXg';
const stateCoords = [-79.8, 35.3];
const defaultZoom = 6;

/**
 * Add the map to the page
 */
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: stateCoords,
    zoom: defaultZoom,
    scrollZoom: false
});

const meetings = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [-82.547049, 35.595747]
            },
            'properties': {
                'government': 'Buncombe County',
                'publicbody': 'Affordable Housing Committee',
                'location': 'Buncombe County Permits & Inspections',
                'address': '30 Valley Street, Meeting Room, Asheville, NC 28801',
                'schedule': '1st Tuesday of every month',
                'start': '1:00 PM',
                'end': '2:30 PM',
                'remote':'',
                'id':'1'
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [-82.55529, 35.59748]
            },
            'properties': {
                'government': 'City of Asheville',
                'publicbody': 'Asheville City Council',
                'location': 'Harrah’s Cherokee Center',
                'address': '87 Haywood St, Asheville, NC 28801',
                'schedule': 'Second and fourth Tuesday of every monthh',
                'start': '5:00 PM',
                'end': '',
                'remote':'',
                'id': '2'
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [-82.54826026293046, 35.598922154690385]
            },
            'properties': {
                'government': 'Asheville-Buncombe County',
                'publicbody': 'AB Tech/Buncombe County Joint Capital Advisory Committee',
                'location': 'County Administration Building',
                'address': '200 College Street, Asheville, NC 28801',
                'schedule': 'As needed',
                'start': '',
                'end': '',
                'remote':'Zoom',
                'id':'3'
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [-82.548260262931, 35.59892215469039]
            },
            'properties': {
                'government': 'Buncombe County',
                'publicbody': 'Ad Hoc Reappraisal Committee',
                'location': 'County Administration Building',
                'address': '200 College Street, Asheville, NC 28801',
                'schedule': '1st and 3rd Wednesday of every month',
                'start': '5:00 PM',
                'end': '7:00 PM',
                'remote':'Watch live through the Engagement Hub: Public Engagement Hub or watch live on the City YouTube Channel.\nListen live by calling 855-925-2801 Enter Code 9409.\nPre-recorded voicemail comments by calling 855-925-2801 Enter Code 9409.  Voicemail comments will be accepted until Wednesday, April 13 at 5:00 p.m.\nWritten public comments by email – AAHCAVL@PublicInput.com.',
                'id':'4'
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [-82.6231, 35.601185]
            },
            'properties': {
                'government': 'Buncombe County',
                'publicbody': 'Adult Care Home Community Advisory Committee',
                'location': 'Land of Sky Regional Council Offices',
                'address': '339 New Leicester Highway, Asheville, NC 28806',
                'schedule': '3rd Friday of each month',
                'start': '9:00 AM',
                'end': '',
                'remote':'',
                'id':'5'
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [-82.54873467670735, 35.596417199178475]
            },
            'properties': {
                'government': 'Asheville-Buncombe County',
                'publicbody': 'African American Heritage Commission',
                'location': 'City Hall',
                'address': '70 Court Plaza, 1st Floor North Conference Room Asheville, NC 28801 ',
                'schedule': '2nd Thursday of each month',
                'start': '11:30 AM',
                'end': '',
                'remote':'Watch live through the Engagement Hub: Public Engagement Hub or watch live on the City YouTube Channel.\nListen live by calling 855-925-2801 Enter Code 9409.\nPre-recorded voicemail comments by calling 855-925-2801 Enter Code 9409.  Voicemail comments will be accepted until Wednesday, April 13 at 5:00 p.m.\nWritten public comments by email – AAHCAVL@PublicInput.com.',
                'id':'6'
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [-82.6328, 35.61869]
            },
            'properties': {
                'government': 'Buncombe County',
                'publicbody': 'Agricultural Advisory Board for Farmland Preservation',
                'location': 'Soil & Water Conference',
                'address': '49 Mt. Carmel Road, Asheville, NC 28806',
                'schedule': '3rd Tuesday of each month',
                'start': '11:00 AM',
                'end': '12:00 PM ',
                'remote':'Zoom',
                'id':'7'
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates':[-82.54873467670735, 35.596417199178475]
            },
            'properties': {
                'government': 'City of Ashevile',
                'publicbody': 'Asheville Board of Adjustment',
                'location': 'City Hall',
                'address': '70 Court Plaza, 1st Floor North Conference Room Asheville, NC 28801',
                'schedule': '4th Monday of each month',
                'start': '2:00 PM',
                'end': '',
                'remote':'Zoom',
                'id':'8'
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates':[-82.56039420232847, 35.597385858594926]
            },
            'properties': {
                'government': 'Asheville-Buncombe County',
                'publicbody': 'Asheville-Buncombe Regional Sports Commission',
                'location': 'Chamber of Commerce',
                'address': '36 Montford Ave, Asheville, NC 28801',
                'schedule': '4th Monday of each month',
                'start': '',
                'end': '',
                'remote':'',
                'id':'9'
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates':[-79.4014219293032, 36.06924312939426]
            },
            'properties': {
                'government': 'Alamance County',
                'publicbody': 'County Commissioners',
                'location': 'County Office Building',
                'address': '124 W. Elm St., Commissioners Meeting Room located on the 2nd Floor, Graham, NC  27253',
                'schedule': '1st Monday and 3rd Monday of the month',
                'start': '9:00 AM and 7:00 PM, respectively',
                'end': '',
                'remote':'Video recordings of our Commissioners Meetings both online and on the local Time-Warner Public Access Channels.  The television broadcast of the meetings will occur on the 2nd and 4th Wednesdays of each month at 10 PM.  Online videos will be made available after processing the videos through Youtube, our service providers for multimedia.  The meetings are now streamed live.',
                'id':'10'
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates':[-79.451182400000019,36.08054825636156]
            },
            'properties': {
                'government': 'Alamance County',
                'publicbody': 'Adult Care Home Community Advisory Committee',
                'location': 'J. R. Kernodle Senior Center',
                'address': '1535 S Mebane St, Burlington NC 27215',
                'schedule': '3rd Tuesday of each quarter',
                'start': '2:00 PM',
                'end': '',
                'remote':'Unknown',
                'id':'11'
            }
        },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates':[-79.4014219293032, 36.06924312939426]
            },
            'properties': {
                'government': 'My New Meeting County',
                'publicbody': 'My New Meeting',
                'location': 'Place',
                'address': '124 W. Elm St., Commissioners Meeting Room located on the 2nd Floor, Graham, NC  27253',
                'schedule': '1st Monday and 3rd Monday of the month',
                'start': '9:00 AM and 7:00 PM, respectively',
                'end': '',
                'remote':'Video recordings of our Commissioners Meetings both online and on the local Time-Warner Public Access Channels.  The television broadcast of the meetings will occur on the 2nd and 4th Wednesdays of each month at 10 PM.  Online videos will be made available after processing the videos through Youtube, our service providers for multimedia.  The meetings are now streamed live.',
                'id':'12'
            }
        },
    ]
};

/**
 * Wait until the map loads to make changes to the map.
 */
map.on('load', () => {
    /**
     * This is where your '.addLayer()' used to be, instead
     * add only the source without styling a layer
     */
    // map.addSource('places', {
    //     'type': 'geojson',
    //     'data': meetings
    // });

    /**
     * Add all the things to the page:
     * - The location listings on the side of the page
     * - The markers onto the map
     */
    // buildLocationList(meetings);
    // addMarkers(meetings);
    console.log('map loaded')
    fetch("meetings.json")
      .then((response) => {
        console.log('got', response.json())
        return response.json;
      })
      .then(data => console.log(data))
    // .then(moreMeetings => {
    //     map.addSource('morePlaces', {
    //         'type': 'geojson',
    //         'data': moreMeetings
    //     });
    //     buildCountyList(moreMeetings)
    // })
    .catch((error) => {
      console.log('failed to get meetings', error)
    });
});

/**
 * Add a marker to the map for every meeting listing.
 **/
function addMarkers(meetings) {
    /* For each feature in the GeoJSON object above: */
    for (const marker of meetings) {
        /* Create a div element for the marker. */
        const el = document.createElement('div');
        /* Assign a unique `id` to the marker. */
        el.id = `marker-${marker.properties.id}`;
        /* Assign the `marker` class to each marker for styling. */
        el.className = 'marker';

        /**
          * Create a marker using the div element
          * defined above and add it to the map.
          **/
        new mapboxgl.Marker(el, { offset: [0, -23] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);

        /**
          * Listen to the element and when it is clicked, do three things:
          * 1. Fly to the point
          * 2. Close all other popups and display popup for clicked meeting
          * 3. Highlight listing in sidebar (and remove highlight for all other listings)
          **/
        el.addEventListener('click', (e) => {
            /* Fly to the point */
            flytoMeeting(marker.geometry.coordinates, 15);
            /* Close all other popups and display popup for clicked meeting */
            createPopUp(marker);
            /* Highlight listing in sidebar */
            const activeItem = document.getElementsByClassName('active');
            e.stopPropagation();
            if (activeItem[0]) {
                activeItem[0].classList.remove('active');
            }
            const listing = document.getElementById(
                `listing-${marker.properties.id}`
            );
            listing.classList.add('active');
        });
    }
}

/**
  * Clear the map of markers and zoom back out
  * Remove popup
  */
  function removeAllMarkers() {
    const markers = document.querySelectorAll('.marker')
    const popup = document.querySelector('.mapboxgl-popup')
    if(popup) popup.remove()
    for(const marker of markers) {
        marker.remove()
    }
    flytoMeeting();
  }

/**
  * Builds and returns a full meeting list separated by county
**/
function buildMeetingListByCounty(meetingList) {
    return meetingList.features.reduce((obj, item) => {
        const county = item.properties.government;

        if (county !== "") {
            if (!obj[county]) {
                obj[county] = [{properties: {...item.properties}, geometry: {...item.geometry}}];
            } else {
                obj[county].push({properties: {...item.properties}, geometry: {...item.geometry}});
            }
        }
        return obj;
    }, []);
}

/**
  * Adds the County list to sidebar
**/
function buildCountyList(meetingList) {
    const countyList = buildMeetingListByCounty(meetingList)
    const counties = document.querySelector('#counties');
    /* Sort list of counties */
    const sortedCounties = Object.keys(countyList).sort((c1, c2) => c1.localeCompare(c2))

    for (const countyName of sortedCounties) {

        /* Add a new county listing section to the sidebar. */
        const county = counties.appendChild(document.createElement('div'));
        /* Assign the `item` class to each listing for styling. */
        county.className = 'item';

        /* Add the link to the individual listing created above. */
        const link = county.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.id = `${countyName}`;
        link.innerHTML = `${countyName}`

    }
    /**
      * Uses event delegation to listen for clicks on list items
      * Build meeting list for the county and add markers to map
      **/

    counties.addEventListener('click', function(event) {
        // ignore if not clicking on link
        if(!event.target.matches('.title')) return
        event.preventDefault();

        // hide counties list when a county is clicked
        counties.style.display = 'none'

        const meetingList = countyList[event.target.id]

        /* Fly to general are of listings*/
        flytoMeeting(meetingList[0].geometry.coordinates, 8)
        buildLocationList(meetingList)
        addMarkers(meetingList)
    }, false)
    return countyList
}

/**
  *  Back button handles re-showing the county list
  *  Removes previous meeting listings and each event handler
  *  Removes markers from maps
  *  String with selector type is required for now
  *  Future: pass the elements as arguments
  **/
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

/**
  * Add a listing for each meeting to the sidebar.
  **/
function buildLocationList(meetings) {
    /* Add back button to top of list to nav back to counties */
    backButton('#counties', '#listings', '.item')

    /* Continue to add meeting listings */
    for (const meeting of (meetings)) {
        /* Add a new listing section to the sidebar. */
        const listings = document.getElementById('listings');
        const listing = listings.appendChild(document.createElement('div'));
        /* Assign a unique `id` to the listing. */
        listing.id = `listing-${meeting.properties.id}`;
        /* Assign the `item` class to each listing for styling. */
        listing.className = 'item';

        /* Add the link to the individual listing created above. */
        const link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.id = `link-${meeting.properties.id}`;
        link.innerHTML = `${meeting.properties.publicbody}`;

        /* Add details to the individual listing. */
        const details = listing.appendChild(document.createElement('div'));
        details.innerHTML = `${meeting.properties.location}`;
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
        link.addEventListener('click', function () {
            for (const feature of meetings) {
                if (this.id === `link-${feature.properties.id}`) {
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

/**
  * Use Mapbox GL JS's `flyTo` to move the camera smoothly
  * a given center point.
  * Defaults: coords = center of State, zoomLevel = state in focus
  **/
function flytoMeeting(coords = stateCoords, zoomLevel = defaultZoom) {
    map.flyTo({
        center: coords,
        zoom: zoomLevel
    });
}

/**
  * Create a Mapbox GL JS `Popup`.
  **/
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

//adding zoom and rotation controls to map
map.addControl(new mapboxgl.NavigationControl());
