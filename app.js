$.get("https://corona.lmao.ninja/v2/continents?yesterday=true&sort", (data) => {
  data.forEach(appendCardtoContainer);
});

const appendCardtoContainer = (element) => {
  let card = createCard(element);
  const cardType = $(`<div class="col-md-4 col-sm-6 mb-4"></div>`);
  cardType.append(card);
  $("#container").append(cardType);
};

function createCard(element) {
  const name = element.continent;
  const continentActiveCase = `<li>ActiveCases: ${element.active}</li>`;
  const continentNewCase = `<li>NewCases: ${element.todayCases}</li>`;
  const continentNewDeath = `<li>NewDeath: ${element.todayDeaths}</li>`;
  const continentNewRecovered = `<li>NewRecovered: ${element.todayRecovered}</li>`;
  const continentTested = `<li>Tested: ${element.testsPerOneMillion}</li>`;
  const continentDeathRatio = `<li>DeathPerMillion: ${element.deathsPerOneMillion}</li>`;
  const continentRecovered = `<li>RecoveredPerMillion: ${element.recoveredPerOneMillion}</li>`;

  const continentDiv = $(`<div class="card"></div`);
  const continentheader = $(`<div class="card-header">${name}</div>`);
  const continentBody = $(`<div class="card-body"></div>`);
  const continentInfo = $(`<div class="card-info"></div>`);
  const showMoreButton = $(`<button type="button" class="detailButton btn btn-outline-info">Show More</button>`);

  //*! structure the dropdown list for country in side the function
  showMoreButton.click((event) => {
    let countryList = element.countries;
    $("#container").hide();
    $("#container2").show();
    $('.cName').remove();

    countryList.forEach((country) => {
      const countryName = `<option value="${country}" class="cName">${country}</option>`;
      $("#countries").append(countryName);
    });
  });

  continentBody.append(
    continentActiveCase,
    continentNewCase,
    continentNewDeath,
    continentNewRecovered,
    continentTested,
    continentDeathRatio,
    continentRecovered
  );
  continentInfo.append(showMoreButton);
  continentDiv.append(continentheader, continentBody, continentInfo);
  return continentDiv;
}

//*! below are country get request:

$("#countries").on("change", (event) => {
  let countryData = $("#countries option:selected").val();
  $.get(
    `https://corona.lmao.ninja/v2/countries/${countryData}?yesterday=true&strict=true`,
    (details) => {
      $('#detailCard').remove();
      $('#chart').remove();

      let countryCard = createCardforCountry(details);
      const cardType = $(`<div class="col-md-6 col-sm-12 mb-4" style="margin: auto;"></div>`);
      cardType.append(countryCard)
      $("#container2").append(cardType);

      const chart = $(`<canvas id="chart"></canvas>`);
      $("#chart-container").append(chart);

      new Chart(chart, {
        type: 'bar',
        data: {
          labels: ['NewCases', 'TotalCases', 'TodayDeaths', 'TotalDeaths', 'TodayRecovered', 'TotalRecovered'],
          datasets: [{
            label: `${details.country} Covid-19 Data`,
            data: [details.todayCases, details.cases, details.todayDeaths, details.deaths, details.todayRecovered, details.recovered],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  );
}
);

function createCardforCountry(element) {
  const name = element.country;
  const newCase = `<li>NewCases: ${element.todayCases}</li>`;
  const totalCase = `<li>TotalCases: ${element.cases}</li>`;
  const newDeath = `<li>NewDeath: ${element.todayDeaths}</li>`;
  const totalDeath = `<li>TotalDeath: ${element.deaths}</li>`;
  const newRecovered = `<li>NewRecovered: ${element.todayRecovered}</li>`;
  const Recovered = `<li>TotalRecovered: ${element.recovered}</li>`;

  const countryDiv = $(`<div class="card" id="detailCard"></div`);
  const countryHeader = $(`<div class="card-header">${name}</div>`);
  const countryBody = $(`<div class="card-body"></div>`);
  const countryInfo = $(`<div class="card-info"></div>`);

  countryBody.append(
    newCase,
    totalCase,
    newDeath,
    totalDeath,
    newRecovered,
    Recovered
  );
  countryDiv.append(countryHeader, countryBody, countryInfo);
  return countryDiv;
}

$('#home').click((event) => {
  $("#container").show();
  $("#container2").hide();
})

$(document).ajaxError(() => { alert('Something went wrong!') });

$('#searchButton').click((e) => {
  e.preventDefault()
  let inputVal = $("#searchCountry").val();
  $.get(`https://corona.lmao.ninja/v2/countries/${inputVal}?yesterday=true&strict=true`,
    (details) => {
      $('#detailCard').remove();
      let countryCard = createCardforCountry(details);
      const cardType = $(`<div class="col-md-6 col-sm-12 mb-4" style="margin: auto;"></div>`);
      cardType.append(countryCard)
      $("#container2").append(cardType);
      $("#container2").show();
      $('#container').hide()

      $('#chart').remove();
      const chart = $(`<canvas id="chart"></canvas>`);
      $("#chart-container").append(chart);
      new Chart(chart, {
        type: 'bar',
        data: {
          labels: ['NewCases', 'TotalCases', 'TodayDeaths', 'TotalDeaths', 'TodayRecovered', 'TotalRecovered'],
          datasets: [{
            label: `${details.country} Covid-19 Data`,
            data: [details.todayCases, details.cases, details.todayDeaths, details.deaths, details.todayRecovered, details.recovered],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      }
      );
    })
}
)

//Show the loader/spinner whenever an AJAX request starts 
$(document).ajaxStart(function () {
  $('#loader').show();
  $('.container').hide()
})
//hider spinner whenever all AJAX requests have ended. 
$(document).ajaxStop(function () {
  $('#loader').hide();
  $('.container').show()
});

