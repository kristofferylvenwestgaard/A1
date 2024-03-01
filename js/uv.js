//Store form data
const form = document.forms["searchUV"];
let container = false;

//atob("YkJJTFBqOGV5ME5TNjNqWUdsQ1l6UVFwcUJ0NWFyYTk=");
const peloton = "bBILPj8ey0NS63jYGlCYzQQpqBt5ara9";

//HandleSubmit event on location UV Index form
const submitSearch = async (e) => {
    e.preventDefault();
    try {
        const city = form.search.value;
        //console.log(city);
        const locKey = await getLocationKey(city);
        //console.log(locKey);
        const uv = await getUV(locKey);
        listUVResult(uv, city);
    } catch (error) {
       console.log(error);
    }
}

//Execute API call on form submit
form.addEventListener("submit", submitSearch)

//Get location key from search query
const getLocationKey = async (searchTerm) => {
    //Store form input for location
    const location = searchTerm;
    //console.log(location);

    //Endpoint to location key for search input location
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
        //Input validation on form input - frontend feedback + style
        const error = "Fant ikke stedet du søkte etter. Prøv nærmeste by. f.eks Oslo";
        inputLabel.classList.add("error");
        inputLabel.innerHTML = error;
        input.classList.add("error");
        throw new Error(error);
    }
}

//Show UV listing for location
const listUVResult = (obj, city) => {
    let main = document.getElementById("queryResult");

    //Prevent doubling up the frontend output
    if(container) {
        main.removeChild(container);
    }

    //Create container for API call result
    container = document.createElement("div");
    //Add class to container
    container.setAttribute("class", "uvResult")
    //Add container to main flow
    main.appendChild(container);

    //Change h3 content from UV to "UV-stråling rundt" + remove initial styling
    let h3 = document.getElementById("uvTitle");
    h3.classList.remove("initialTitle");
    h3.innerText = `UV-indeks rundt ${city}:`;

    //Create top bar for UV index widget
    const widgetTop = document.createElement("div");
    widgetTop.setAttribute("class", "widgetTop");

    //Creates labels correlating to the correct infoblock section
    const level = document.createElement("p");
    level.setAttribute("class", "uvlevel");
    
    //Store level text values
    let levelText;
    const uvValues = {
        low: "Lav stråling",
        mid: "Middels stråling",
        high: "Høy stråling",
        xhigh: "Ekstra høy stråling",
        extreme: "Ekstrem stråling"
    };

    //Check that the data and index in return object actually exists or return error
    if(obj.DailyForecasts && obj.DailyForecasts.length && obj.DailyForecasts[0].AirAndPollen && obj.DailyForecasts[0].AirAndPollen.length > 5) {
        //Data from return object
        const value = obj.DailyForecasts[0].AirAndPollen[5].Value;
        
        //Create bar and container for UV varsel
        const barContainer = document.createElement("div");
        const bar = document.createElement("div");
        const barValue0 = document.createElement("div");
        const barValue1 = document.createElement("div");
        const barValue2 = document.createElement("div");
        const barValue3 = document.createElement("div");
        const barValue4 = document.createElement("div");

        //Add class for barContainer and bar
        barContainer.setAttribute("class", "uvbar");
        bar.setAttribute("class", "bar");

        //Add class .barvalue for the bar elements
        barValue0.setAttribute("class", "barvalue");
        barValue1.setAttribute("class", "barvalue");
        barValue2.setAttribute("class", "barvalue");
        barValue3.setAttribute("class", "barvalue");
        barValue4.setAttribute("class", "barvalue");

        //Import UV icon and add class
        const uvIcon = new Image(24,24);
        uvIcon.src = "img/ic-uv.svg";
        uvIcon.setAttribute("class", "uvIcon");

        //Set UV-Index values + levelbadge value + Add color to bar and icon background
        if(value < 3) {
            levelText = document.createTextNode(uvValues.low);
            level.appendChild(levelText);
            level.classList.add("blue")
            barValue0.classList.add("blue");
            uvIcon.classList.add("blue");
        } else if(value < 6){
            levelText = document.createTextNode(uvValues.mid);
            level.appendChild(levelText);
            level.classList.add("green");
            barValue0.classList.add("green");
            barValue1.classList.add("green");
            uvIcon.classList.add("green");
        } else if(value < 8) {
            levelText = document.createTextNode(uvValues.high);
            level.appendChild(levelText);
            level.classList.add("yellow");
            barValue0.classList.add("yellow");
            barValue1.classList.add("yellow");
            barValue2.classList.add("yellow");
            uvIcon.classList.add("yellow");
        } else if(value < 11 ) {
            levelText = document.createTextNode(uvValues.xhigh);
            level.appendChild(levelText);
            level.classList.add("orange");
            barValue0.classList.add("orange");
            barValue1.classList.add("orange");
            barValue2.classList.add("orange");
            barValue3.classList.add("orange");
            uvIcon.classList.add("orange");
        } else {
            levelText = document.createTextNode(uvValues.extreme);
            level.appendChild(levelText);
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



        //Create UV Index top widget element with uv index and icon in rounded block
        const uvIndexContainer = document.createElement("div");
        uvIndexContainer.setAttribute("class", "uvIndexContainer")

        //Create h3 uv index value output
        const uvIndex = document.createElement("h3");
        uvIndex.setAttribute("id", "uvIndex");
        
        //Add UV index value to h3   
        uvIndex.append("UV " + value);

        //Add index and icon to the rounded element
        uvIndexContainer.appendChild(uvIcon);
        uvIndexContainer.appendChild(uvIndex);

        //Add widgetTop to uv index container
        container.appendChild(widgetTop);

        //Add the rounded icon+uvIndex block to the widgetTop
        widgetTop.appendChild(uvIndexContainer);

        //Add the level badge to the widgetTop;
        widgetTop.appendChild(level);

        //Add bar to container
        container.appendChild(bar);
    } else {
        throw new Error("Did not receive any data for that location");
    }
}

    