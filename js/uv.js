//location key Oslo = 254946
const form = document.forms["searchUV"];
let container = false;
const key1 = "aPvjzXtDpJEvYp3SB4sHSoDULatS7KwF";
const key2 = "bBILPj8ey0NS63jYGlCYzQQpqBt5ara9";

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
    const endpoint = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${key1}&q=${location}&language=no&details=true`;
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
        const endpoint = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${key1}&language=no&details=true&metric=true`;
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

    //Creates the anchor link pointing to the correct infoblock section
    const level = document.createElement("p");
    level.setAttribute("class", "uvlevel");
    let linkText;

    //Add icon for weather forecast
    const icon = document.createElement("img");
    
    const uvValues = {
        low: "Lav stråling",
        mid: "Middels stråling",
        high: "Høy stråling",
        xhigh: "Ekstra høy stråling",
        extreme: "Ekstrem stråling"
    };
    const value = obj.DailyForecasts[0].AirAndPollen[5].Value;

    //Create bar for UV varsel
    const barContainer = document.createElement("div");
    const bar = document.createElement("div");
    const barValue0 = document.createElement("div");
    const barValue1 = document.createElement("div");
    const barValue2 = document.createElement("div");
    const barValue3 = document.createElement("div");
    const barValue4 = document.createElement("div");

    //Add class .barvalue for the bar elements
    barContainer.setAttribute("class", "uvbar");
    bar.setAttribute("class", "bar");
    barValue0.setAttribute("class", "barvalue");
    barValue1.setAttribute("class", "barvalue");
    barValue2.setAttribute("class", "barvalue");
    barValue3.setAttribute("class", "barvalue");
    barValue4.setAttribute("class", "barvalue");

    //Set UV-Index values and linktext + ADD COLOR TO BAR
    if(value < 3) {
        linkText = document.createTextNode(uvValues.low);
        level.appendChild(linkText);
        barValue0.classList.add("blue");
    } else if(value < 6){
        linkText = document.createTextNode(uvValues.mid);
        level.appendChild(linkText);
        barValue0.classList.add("green");
        barValue1.classList.add("green");
    } else if(value < 8) {
        linkText = document.createTextNode(uvValues.high);
        level.appendChild(linkText);
        barValue0.classList.add("yellow");
        barValue1.classList.add("yellow");
        barValue2.classList.add("yellow");
    } else if(value < 11 ) {
        linkText = document.createTextNode(uvValues.xhigh);
        level.appendChild(linkText);
        barValue0.classList.add("orange");
        barValue1.classList.add("orange");
        barValue2.classList.add("orange");
        barValue3.classList.add("orange");
    } else {
        linkText = document.createTextNode(uvValues.extreme);
        level.appendChild(linkText);
        barValue0.classList.add("red");
        barValue1.classList.add("red");
        barValue2.classList.add("red");
        barValue3.classList.add("red");
        barValue4.classList.add("red");
    };

    //Add all bars to the bar, and adding bar to barContainer.
    bar.appendChild(barValue0);
    bar.appendChild(barValue1);
    bar.appendChild(barValue2);
    bar.appendChild(barValue3);
    bar.appendChild(barValue4);
    barContainer.appendChild(bar);

    icon.setAttribute("src", "img/sun.png");
    icon.setAttribute("class", "weatherIcon");

    //Add h2 heading to list out location name
    const uvIndex = document.createElement("p");
    uvIndex.setAttribute("id", "uvIndex");
    //Add city search string to location h2
        
    uvIndex.append("UV Indeks: " + value);

    //Add location title to container
    container.appendChild(uvIndex);

    //Add bar to container
    container.appendChild(bar);

    //container.appendChild(bar);
    container.appendChild(level);
}