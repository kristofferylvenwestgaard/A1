//location key Oslo = 254946
const form = document.forms["searchUV"];
let container = false;

//HandleSubmit event on location UV Index form
const submitSearch = async (e) => {
    e.preventDefault();
    const city = form.search.value;
    // console.log(city);
    // const locKey = await getLocationKey(city);
    // console.log(locKey);
    // const uv = await getUV(locKey);
    listUVResult("", city);
    return;
}

form.addEventListener("submit", submitSearch)

//Get location key from search query
const getLocationKey = async (searchTerm) => {
    const location = searchTerm;
    console.log(location);
    const endpoint = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=bBILPj8ey0NS63jYGlCYzQQpqBt5ara9&q=${location}&language=no&details=true`;
    try {
        const response = await fetch(endpoint);
        if(response.ok) {
            const result = await response.json();
            return result;
        }
    } catch (error) {
        throw new Error("Something failed");
    }
}

//Get UV Index for location "c"
const getUV = async (c) => {
    const locationKey = c[0].key;
    console.log(c[0].key);
    const endpoint = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=bBILPj8ey0NS63jYGlCYzQQpqBt5ara9&language=no&details=true&metric=true`;
    try{
        const response = await fetch(endpoint);
        if(response.ok) {
            const result = await response.json();
            return console.log(result);
        }
    } catch(err) {
        throw new Error("Something failed");
    }
}

//Show UV listing for location
const listUVResult = (obj, city) => {
    let main = document.getElementById("greyBlock");
    if(container) {
        main.removeChild(container);
    }
    //Create container for API call result
    container = document.createElement("div");
    //Add container to main flow
    main.appendChild(container);

    //Change h3 content from UV to "UV-stråling rundt"
    let h3 = document.getElementById("uvTitle");
    h3.innerText = `UV-stråling rundt ${city}:`;

    //Add icon for weather forecast
    const icon = document.createElement("img");
    icon.setAttribute("src", "img/ic_minside.svg");
    //Add icon to container
    container.appendChild(icon);

    //Add h2 heading to list out location name
    const uvIndex = document.createElement("h2");
    uvIndex.setAttribute("id", "uvIndex");
    //Add city search string to location h2
    uvIndex.append("2 - Lav stråling");

    //Add location title to container
    container.appendChild(uvIndex);
    
    const test = document.getElementById("locTitle");
    
    console.log(test);
}