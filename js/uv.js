//location key Oslo = 254946
const form = document.forms["searchUV"];
let container = false;

const peloton = atob("YkJJTFBqOGV5ME5TNjNqWUdsQ1l6UVFwcUJ0NWFyYTk=");

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
    const endpoint = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${peloton}&q=${location}&language=no&details=true`;
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
    const input = document.getElementById("inp");
    const inputLabel = document.getElementById("inpLabel");
    console.log(c);
    if(c.length > 0) {
        if(inputLabel.classList.contains("error")) {
            input.classList.remove("error");
            inputLabel.classList.remove("error");
            inputLabel.innerHTML = "Søk etter din nærmeste by";
        }
        locationKey = c[0].Key;
        console.log(locationKey);
        const endpoint = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${peloton}&language=no&details=true&metric=true`;
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
        const error = "Fant ikke stedet du søkte etter. Prøv nærmeste by.";
        inputLabel.classList.add("error");
        inputLabel.innerHTML = error;
        input.classList.add("error");
        throw new Error(error);
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
    h3.innerText = `UV-indeks rundt ${city}:`;

    //Creates the anchor link pointing to the correct infoblock section
    const level = document.createElement("p");
    level.setAttribute("class", "uvlevel");
    let linkText;
    
    const uvValues = {
        low: "Lav stråling",
        mid: "Middels stråling",
        high: "Høy stråling",
        xhigh: "Ekstra høy stråling",
        extreme: "Ekstrem stråling"
    };

    if(obj.DailyForecasts && obj.DailyForecasts.length && obj.DailyForecasts[0].AirAndPollen && obj.DailyForecasts[0].AirAndPollen.length > 5) {
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
        const uvIcon = new Image(24,24);
        uvIcon.src = "img/ic-uv.svg";
        uvIcon.setAttribute("class", "uvIcon");

        //Set UV-Index values and linktext + ADD COLOR TO BAR
        if(value < 3) {
            linkText = document.createTextNode(uvValues.low);
            level.appendChild(linkText);
            level.classList.add("blue")
            barValue0.classList.add("blue");
            uvIcon.classList.add("blue");
        } else if(value < 6){
            linkText = document.createTextNode(uvValues.mid);
            level.appendChild(linkText);
            level.classList.add("green");
            barValue0.classList.add("green");
            barValue1.classList.add("green");
            uvIcon.classList.add("green");
        } else if(value < 8) {
            linkText = document.createTextNode(uvValues.high);
            level.appendChild(linkText);
            level.classList.add("yellow");
            barValue0.classList.add("yellow");
            barValue1.classList.add("yellow");
            barValue2.classList.add("yellow");
            uvIcon.classList.add("yellow");
        } else if(value < 11 ) {
            linkText = document.createTextNode(uvValues.xhigh);
            level.appendChild(linkText);
            level.classList.add("orange");
            barValue0.classList.add("orange");
            barValue1.classList.add("orange");
            barValue2.classList.add("orange");
            barValue3.classList.add("orange");
            uvIcon.classList.add("orange");
        } else {
            linkText = document.createTextNode(uvValues.extreme);
            level.appendChild(linkText);
            level.classList.add("red");
            barValue0.classList.add("red");
            barValue1.classList.add("red");
            barValue2.classList.add("red");
            barValue3.classList.add("red");
            barValue4.classList.add("red");
            uvIcon.classList.add("red");
        };

        //Add all bars to the bar, and adding bar to barContainer.
        bar.appendChild(barValue0);
        bar.appendChild(barValue1);
        bar.appendChild(barValue2);
        bar.appendChild(barValue3);
        bar.appendChild(barValue4);
        barContainer.appendChild(bar);

        //Add h2 heading to list out location name
        const uvIndexContainer = document.createElement("div");
        uvIndexContainer.setAttribute("class", "uvIndexContainer")
        const uvIndex = document.createElement("h3");
        uvIndex.setAttribute("id", "uvIndex");
        //Add city search string to location h2
            
        uvIndex.append("UV " + value);
        uvIndexContainer.appendChild(uvIcon);
        uvIndexContainer.appendChild(uvIndex);

        //Add location title to container
        container.appendChild(uvIndexContainer);

        //Add bar to container
        container.appendChild(bar);

        //container.appendChild(bar);
        container.appendChild(level);
    } else {
        throw new Error("Did not receive any data for that location");
    }
}

    