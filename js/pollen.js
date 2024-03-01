//Store form data
const form = document.forms["searchPollen"];
let containerTree = false;
let containerGrass = false;

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
        const pollen = await getPollen(locKey);
        listPollenResult(pollen, city);
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
const getPollen = async (c) => {
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
const listPollenResult = (obj, city) => {
    let main = document.getElementById("queryResult");

    //Prevent doubling up the frontend output
    if(containerTree || containerGrass) {
        main.removeChild(containerTree);
        main.removeChild(containerGrass);
    }

    //Create container for API call result
    containerTree = document.createElement("div");
    containerGrass = document.createElement("div");
    //Add class to container
    containerTree.setAttribute("class", "pollenResult")
    containerGrass.setAttribute("class", "pollenResult")
    //Add container to main flow
    main.appendChild(containerTree);
    main.appendChild(containerGrass);

    //Change h3 content from UV to "UV-stråling rundt" + remove initial styling
    let h3 = document.getElementById("pollenTitle");
    h3.classList.remove("initialTitle");
    h3.innerText = `Pollenvarsel rundt ${city}:`;

    //Create top bar for UV index widget
    const widgetTopTree = document.createElement("div");
    widgetTopTree.setAttribute("class", "widgetTop");

    const widgetTopGrass = document.createElement("div");
    widgetTopGrass.setAttribute("class", "widgetTop");

    //Creates labels correlating to the correct infoblock section
    const levelTree = document.createElement("p");
    levelTree.setAttribute("class", "pollenlevel");

    const levelGrass = document.createElement("p");
    levelGrass.setAttribute("class", "pollenlevel");
    
    //Store level text values
    let levelTreeText;
    let levelGrassText;
    const pollenValues = {
        low: "Ingen spredning",
        mid: "Beskjeden spredning",
        high: "Moderat spredning",
        xhigh: "Kraftig spredning",
        extreme: "Ekstrem spredning"
    };

    ///////////////// TREE POLLEN ////////////////


    //Check that the data and index in return object actually exists or return error
    if(obj.DailyForecasts && obj.DailyForecasts.length && obj.DailyForecasts[0].AirAndPollen && obj.DailyForecasts[0].AirAndPollen.length > 5) {
        //Data from return object
        const value = obj.DailyForecasts[0].AirAndPollen[4].Value;
        
        //Create bar and container for UV varsel
        const barContainer = document.createElement("div");
        const bar = document.createElement("div");
        const barValue0 = document.createElement("div");
        const barValue1 = document.createElement("div");
        const barValue2 = document.createElement("div");
        const barValue3 = document.createElement("div");
        const barValue4 = document.createElement("div");

        //Add class for barContainer and bar
        barContainer.setAttribute("class", "pollenbar");
        bar.setAttribute("class", "bar");

        //Add class .barvalue for the bar elements
        barValue0.setAttribute("class", "barvalue");
        barValue1.setAttribute("class", "barvalue");
        barValue2.setAttribute("class", "barvalue");
        barValue3.setAttribute("class", "barvalue");
        barValue4.setAttribute("class", "barvalue");

        //Import UV icon and add class
        const treeIcon = new Image(24,24);
        treeIcon.src = "img/ic-tree.svg";
        treeIcon.setAttribute("class", "pollenIcon");

        //Set UV-Index values + levelbadge value + Add color to bar and icon background
        if(value === 0) {
            levelTreeText = document.createTextNode(pollenValues.low);
            levelTree.appendChild(levelTreeText);
            levelTree.classList.add("blue")
            barValue0.classList.add("blue");
            treeIcon.classList.add("blue");
        } else if(value >= 1 && value <= 9){
            levelTreeText = document.createTextNode(pollenValues.mid);
            levelTree.appendChild(levelTreeText);
            levelTree.classList.add("green");
            barValue0.classList.add("green");
            barValue1.classList.add("green");
            treeIcon.classList.add("green");
        } else if(value >= 10 && value <= 99) {
            levelTreeText = document.createTextNode(pollenValues.high);
            levelTree.appendChild(levelTreeText);
            levelTree.classList.add("yellow");
            barValue0.classList.add("yellow");
            barValue1.classList.add("yellow");
            barValue2.classList.add("yellow");
            treeIcon.classList.add("yellow");
        } else if(value >= 100 && value <= 999 ) {
            levelTreeText = document.createTextNode(pollenValues.xhigh);
            levelTree.appendChild(levelTreeText);
            levelTree.classList.add("orange");
            barValue0.classList.add("orange");
            barValue1.classList.add("orange");
            barValue2.classList.add("orange");
            barValue3.classList.add("orange");
            treeIcon.classList.add("orange");
        } else {
            levelTreeText = document.createTextNode(pollenValues.extreme);
            levelTree.appendChild(levelTreeText);
            levelTree.classList.add("red");
            barValue0.classList.add("red");
            barValue1.classList.add("red");
            barValue2.classList.add("red");
            barValue3.classList.add("red");
            barValue4.classList.add("red");
            treeIcon.classList.add("red");
        };

        //Add all bars to the bar, and adding bar to barContainer.
        bar.appendChild(barValue0);
        bar.appendChild(barValue1);
        bar.appendChild(barValue2);
        bar.appendChild(barValue3);
        bar.appendChild(barValue4);
        barContainer.appendChild(bar);



        //Create UV Index top widget element with uv index and icon in rounded block
        const treeIndexContainer = document.createElement("div");
        treeIndexContainer.setAttribute("class", "pollenIndexContainer")

        //Create h3 uv index value output
        const pollenIndex = document.createElement("h3");
        pollenIndex.setAttribute("id", "pollenIndex");
        
        //Add UV index value to h3   
        pollenIndex.append("Trepollen " + value);

        //Add index and icon to the rounded element
        treeIndexContainer.appendChild(treeIcon);
        treeIndexContainer.appendChild(pollenIndex);

        //Add widgetTop to uv index container
        containerTree.appendChild(widgetTopTree);

        //Add the rounded icon+uvIndex block to the widgetTop
        widgetTopTree.appendChild(treeIndexContainer);

        //Add the level badge to the widgetTop;
        widgetTopTree.appendChild(levelTree);

        //Add bar to container
        containerTree.appendChild(bar);
    } else {
        throw new Error("Did not receive any data for that location");
    }

    
    ///////////////// GRASS POLLEN ////////////////


    //Check that the data and index in return object actually exists or return error
    if(obj.DailyForecasts && obj.DailyForecasts.length && obj.DailyForecasts[0].AirAndPollen && obj.DailyForecasts[0].AirAndPollen.length > 5) {
        //Data from return object
        const value = obj.DailyForecasts[0].AirAndPollen[1].Value;
        
        //Create bar and container for UV varsel
        const barContainer = document.createElement("div");
        const bar = document.createElement("div");
        const barValue0 = document.createElement("div");
        const barValue1 = document.createElement("div");
        const barValue2 = document.createElement("div");
        const barValue3 = document.createElement("div");
        const barValue4 = document.createElement("div");

        //Add class for barContainer and bar
        barContainer.setAttribute("class", "pollenbar");
        bar.setAttribute("class", "bar");

        //Add class .barvalue for the bar elements
        barValue0.setAttribute("class", "barvalue");
        barValue1.setAttribute("class", "barvalue");
        barValue2.setAttribute("class", "barvalue");
        barValue3.setAttribute("class", "barvalue");
        barValue4.setAttribute("class", "barvalue");

        //Import UV icon and add class
        const grassIcon = new Image(24,24);
        grassIcon.src = "img/ic-grass.svg";
        grassIcon.setAttribute("class", "pollenIcon");

        //Set UV-Index values + levelbadge value + Add color to bar and icon background
        if(value === 0) {
            levelGrassText = document.createTextNode(pollenValues.low);
            levelGrass.appendChild(levelGrassText);
            levelGrass.classList.add("blue")
            barValue0.classList.add("blue");
            grassIcon.classList.add("blue");
        } else if(value >= 1 && value <= 9){
            levelGrassText = document.createTextNode(pollenValues.mid);
            levelGrass.appendChild(levelGrassText);
            levelGrass.classList.add("green");
            barValue0.classList.add("green");
            barValue1.classList.add("green");
            grassIcon.classList.add("green");
        } else if(value >= 10 && value <= 99) {
            levelGrassText = document.createTextNode(pollenValues.high);
            levelGrass.appendChild(levelGrassText);
            levelGrass.classList.add("yellow");
            barValue0.classList.add("yellow");
            barValue1.classList.add("yellow");
            barValue2.classList.add("yellow");
            grassIcon.classList.add("yellow");
        } else if(value >= 100 && value <= 999 ) {
            levelGrassText = document.createTextNode(pollenValues.xhigh);
            levelGrass.appendChild(levelGrassText);
            levelGrass.classList.add("orange");
            barValue0.classList.add("orange");
            barValue1.classList.add("orange");
            barValue2.classList.add("orange");
            barValue3.classList.add("orange");
            grassIcon.classList.add("orange");
        } else {
            levelGrassText = document.createTextNode(pollenValues.extreme);
            levelGrass.appendChild(levelGrassText);
            levelGrass.classList.add("red");
            barValue0.classList.add("red");
            barValue1.classList.add("red");
            barValue2.classList.add("red");
            barValue3.classList.add("red");
            barValue4.classList.add("red");
            grassIcon.classList.add("red");
        };

        //Add all bars to the bar, and adding bar to barContainer.
        bar.appendChild(barValue0);
        bar.appendChild(barValue1);
        bar.appendChild(barValue2);
        bar.appendChild(barValue3);
        bar.appendChild(barValue4);
        barContainer.appendChild(bar);



        //Create UV Index top widget element with uv index and icon in rounded block
        const grassIndexContainer = document.createElement("div");
        grassIndexContainer.setAttribute("class", "pollenIndexContainer")

        //Create h3 uv index value output
        const pollenIndex = document.createElement("h3");
        pollenIndex.setAttribute("id", "pollenIndex");
        
        //Add UV index value to h3   
        pollenIndex.append("Gresspollen " + value);

        //Add index and icon to the rounded element
        grassIndexContainer.appendChild(grassIcon);
        grassIndexContainer.appendChild(pollenIndex);

        //Add widgetTop to uv index container
        containerGrass.appendChild(widgetTopGrass);

        //Add the rounded icon+uvIndex block to the widgetTop
        widgetTopGrass.appendChild(grassIndexContainer);

        //Add the level badge to the widgetTop;
        widgetTopGrass.appendChild(levelGrass);

        //Add bar to container
        containerGrass.appendChild(bar);
    } else {
        throw new Error("Did not receive any data for that location");
    }


    ////////////////// BEISKAMBROSIA /////////////////
}

    