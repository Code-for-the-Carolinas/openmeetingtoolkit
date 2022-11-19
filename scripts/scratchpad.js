

 // Not in use. May not be needed.
 const mergeMeetingData = async () => {

  let geoJson = {
      type: 'FeatureCollection',
      features: []
  }
  try {
      const meetingsGS = await getMeetingGSheetData();
      // const meetingsJson = await getMeetingJsonData();
      // meetingsJson.features.forEach(j => geoJson.features.push(j))

      meetingsGS.features.forEach(f => geoJson.features.push({
          geometry: {
              type: f.geometry.type,
              longitude: f.geometry.coordinates?.[0],
              latitude: f.geometry.coordinates?.[1],
              coordinates: [...f.geometry?.coordinates],

          },
          properties: {
              address: f.properties?.Address,
              end: f.properties?.End_time,
              government: f.properties?.Government,
              id: f.properties?.Id,
              location: f.properties?.Location,
              publicbody: f.properties?.Public_body,
              schedule: f.properties?.Schedule,
              moreInfo: f.properties?.Source,
              start: f.properties?.Start_time,
              remote: f.properties?.Remote_options,
          },
          type: f.type
      }))
      // console.log('geo', geoJson.features)
      return geoJson
  } catch (error) {
      throw error
  }
};



/**
 * Builds and returns a full meeting list separated by county
**/
function buildMeetingListByCounty(meetingList) {
  return meetingList.features.reduce((obj, item) => {
      const county = item.properties.Government || item.properties.government;

      if (county !== "") {
          if (!obj[county]) {
              obj[county] = [{properties: {...item.properties}, geometry: {...item.geometry}}];
          } else {
              obj[county].push({properties: {...item.properties}, geometry: {...item.geometry}});
          }
      }
      return obj;
  }, []);
};

/**
* Adds the County list to sidebar
**/
function buildCountyList(meetingList) {
  const countyList = buildMeetingListByCounty(meetingList)
  const counties = document.querySelector('#listings');
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
      flytoMeeting(meetingList[0].geometry.coordinates, 10)
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