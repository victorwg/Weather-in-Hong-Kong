
window.onload = () => {


  //header
  var header = document.createElement('header');
  document.body.appendChild(header);
  var header_content = "";
  header_content += "<img src=\"images/reload.png\" alt=\"Reload Button\">"; //reload button
  header_content += "<h1>Weather in Hong Kong</h1>"; //title
  header.innerHTML = header_content;
  var reloadBttn = document.querySelector("img");
  reloadBttn.addEventListener("click", () => {
    window.location.reload();
  });

  //option tags
  var tempPage = document.createElement('span'); //current weather
  tempPage.appendChild(document.createTextNode("Temperature"));
  document.body.appendChild(tempPage);

  var forecast = tempPage.cloneNode(true); //9-day weather forecast
  forecast.firstChild.nodeValue = "Forecast";
  document.body.appendChild(forecast);


  //HKO data
  var WR_table = document.createElement('table'); //current weather
  document.body.appendChild(WR_table);
  var WR_table_ID = document.createAttribute('id');
  WR_table_ID.value = "WR";
  WR_table.setAttributeNode(WR_table_ID);

  var WF_table =  document.createElement('table'); //9-day weather forecast
  document.body.appendChild(WF_table);
  var WF_table_ID = document.createAttribute('id');
  WF_table_ID.value = "WF";
  WF_table.setAttributeNode(WF_table_ID);


  //current weather
  //fetch("data/weather-202009302112.json")
  fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en")
  .then (response => {
    if (response.status == 200) {
      response.json().then (WR => {

        //header
        var header_table = document.createElement('table');
        header.appendChild(header_table);
        var htable_content = "";
        htable_content += `<tr colspan="2"><td><img src="https://www.hko.gov.hk/images/HKOWxIconOutline/pic${WR.icon[0]}.png" alt="Weather Icon"></td></tr>`; //Weather icon
        htable_content += `<tr><td><img src="images/thermometer.png" alt="Temperature Icon"></td><td>${WR.temperature.data[1].value}°C</td></tr>`; //Temperature
        htable_content += `<tr><td><img src="images/drop.png" alt="Humidity Icon"></td><td>${WR.humidity.data[0].value}%</td></tr>`; //Humidity
        htable_content += `<tr><td><img src="images/rain.png" alt="Rainfall Icon"></td><td>${WR.rainfall.data[13].max}mm</td></tr>`; //Rainfall
        if (WR.uvindex) {
          htable_content += `<tr><td><img src="images/UVindex.png" alt="UV Level Icon"></td><td>${WR.uvindex.data[0].value}</td></tr>`; //UV Level
        }
        if (WR.warningMessage) {
          htable_content += `<tr id="warningRow"><td id="warning">Warning <img src="images/arrow.png" alt="Toggle Button"></td><td>${WR.warningMessage[0]}</td></tr>`; //Current warning message
        }
        htable_content += "<tr colspan=\"2\" id=\"lastUpdate\"><td>Last Update: "+WR.updateTime.substr(11,5)+"</td></tr>"; //Last update time of this weather report

        header_table.innerHTML = htable_content;

        //HKO data
        var wrtable_content = "";
        for (let district of WR.temperature.data) {
          wrtable_content += `<tr><td><img class="close" src="images/cancel.ico" alt="Close Button"></td>`; //Close
          wrtable_content += "<th>"+district.place+"</th>";
          wrtable_content += "<td>"+district.value+"°C</td></tr>";
        }
        WR_table.innerHTML = wrtable_content;

        //dynamically display the warning message
        //If the arrow is clicked, the message is "locked" and won't diasppear when the mouser moves out
        //Click the arrow again to unlock the message
        if (WR.warningMessage) {
          var warning = document.getElementById("warning");
          var warningMessage = warning.nextSibling;
          warningMessage.style.display = "none";
          warning.style.borderRadius = "15px";
          warning.style.backgroundColor = "#ff4d4d";
          var checked = false;
          warning.addEventListener("click", () => {
            if (checked) {
              warningMessage.style.display = "none";
              warning.style.borderRadius = "15px";
              warning.style.backgroundColor = "#ff4d4d";
              checked = false;
            } else {
              warningMessage.style.display = "block";
              warning.style.borderRadius = "15px 15px 0px 0px";
              warning.style.backgroundColor = "grey";
              checked = true;
            }
          });
          warning.addEventListener("mouseover", () => {
            warningMessage.style.display = "block";
            warning.style.borderRadius = "15px 15px 0px 0px";
            warning.style.backgroundColor = "grey";
          });
          warning.addEventListener("mouseout", () => {
            if (!checked) {
              warningMessage.style.display = "none";
              warning.style.borderRadius = "15px";
              warning.style.backgroundColor = "#ff4d4d";
            }
          });
        }

        //close buttons
        var closeBttns = document.getElementsByClassName("close");
        for (let bttn of closeBttns) {
          bttn.addEventListener("click", () => {
            bttn.parentElement.parentElement.style.display = "none";
          });
        }
      });
    } else {
      console.log("HTTP return status: " + response.status);
    }
  })
  .catch (err => {
    console.log("Fetch Error!");
  });


  //forecast
  //fetch("data/Forecast-202009291227.json")
  fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en")
  .then (response => {
    if (response.status == 200) {
      response.json().then (WF => {
        var wftable_content = "";
        for (let eachDay of WF.weatherForecast) {
          wftable_content += `<tr><td><img src="https://www.hko.gov.hk/images/HKOWxIconOutline/pic${eachDay.ForecastIcon}.png" alt="Weather Icon"></td>`; //Weather icon
          wftable_content += `<th>${parseInt(eachDay.forecastDate.substr(6,2))}/${parseInt(eachDay.forecastDate.substr(4,2))}</th>`; //Date
          wftable_content += `<td>${eachDay.week}</td>`; //Day
          wftable_content += `<td>${eachDay.forecastMintemp.value}°C | ${eachDay.forecastMaxtemp.value}°C</td>`; //Temperature range
          wftable_content += `<td>${eachDay.forecastMinrh.value}% - ${eachDay.forecastMaxrh.value}%</td></tr>`; //Humidity range
        }
        WF_table.innerHTML = wftable_content;
      });
    } else {
      console.log("HTTP return status: " + response.status);
    }
  })
  .catch (err => {
    console.log("Fetch Error!" + err);
  });


  //option tags
  let tempPage_table = document.getElementById("WR");
  let forecast_table = document.getElementById("WF");
  forecast_table.style.display = "none";
  tempPage.addEventListener("click", () => {
    tempPage_table.style.display = "block";
    forecast_table.style.display = "none";
  });
  forecast.addEventListener("click", () => {
    tempPage_table.style.display = "none";
    forecast_table.style.display = "block";
  });
}
