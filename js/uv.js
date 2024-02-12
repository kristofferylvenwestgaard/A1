//location key Oslo = 254946
const form = document.forms["searchUV"];
let container = false;

//HandleSubmit event on location UV Index form
const submitSearch = async (e) => {
    e.preventDefault();
    try {
        const city = form.search.value;
        console.log(city);
        const locKey = await getLocationKey(city);
        console.log(locKey);
        const uv = await getUV(locKey);
        listUVResult(uv, city);
    } catch (error) {
       console.log(error);
    }
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
    let locationKey;
    console.log(c);
    if(c.length > 0) {
        locationKey = c[0].Key;
        console.log(locationKey);
        const endpoint = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=bBILPj8ey0NS63jYGlCYzQQpqBt5ara9&language=no&details=true&metric=true`;
        try{
            const response = await fetch(endpoint);
            if(response.ok) {
                const result = await response.json();
                return result;
            }
        } catch(err) {
            throw new Error("Something failed");
        }
    } else {
        throw new Error("No location found");
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
    container.setAttribute("class", "uvResult")
    //Add container to main flow
    main.appendChild(container);

    //Change h3 content from UV to "UV-stråling rundt"
    let h3 = document.getElementById("uvTitle");
    h3.innerText = `UV-stråling rundt ${city}:`;

    //Add icon for weather forecast
    const icon = document.createElement("img");
    icon.setAttribute("src", "img/sun.png");
    icon.setAttribute("class", "weatherIcon");
    //Add icon to container
    container.appendChild(icon);

    //Add h2 heading to list out location name
    const uvIndex = document.createElement("h2");
    uvIndex.setAttribute("id", "uvIndex");
    //Add city search string to location h2
    uvIndex.append(obj.DailyForecasts[0].AirAndPollen[5].Value + " " + obj.DailyForecasts[0].AirAndPollen[5].Category );

    //Add location title to container
    container.appendChild(uvIndex);
}