const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const interChange = document.querySelector(".fa-solid.fa-arrow-right-arrow-left");
const containers = document.querySelectorAll(".select-container");
const fromContainer = containers[0];
const toContainer = containers[1];
const msg = document.querySelector(".msg");

for(let select of dropdowns) {
    for(currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if(select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        }
        else if(select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
        updateExchangeRate();
    });
}

inputDate.addEventListener("change", () => {
    updateExchangeRate();
});

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

window.addEventListener("load", () => {
    updateExchangeRate();
});

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

interChange.addEventListener("click", () => {
    let fromContainerImg = fromContainer.querySelector("img");
    let toContainerImg = toContainer.querySelector("img");
    let tempImg = fromContainerImg.src;
    fromContainerImg.src = toContainerImg.src;
    toContainerImg.src = tempImg;
    let fromContainerSelect = fromContainer.querySelector("select");
    let toContainerSelect = toContainer.querySelector("select");
    let tempVal = fromContainerSelect.value;
    fromContainerSelect.value = toContainerSelect.value;
    toContainerSelect.value = tempVal;
    updateFlag(fromContainerSelect);
    updateFlag(toContainerSelect);
    updateExchangeRate();
});

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if(amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }
    const URL = `${BASE_URL}${inputDate.value}/v1/currencies/${fromCurr.value.toLowerCase()}.json`;
    let response = await fetch(URL);
    let data = await response.json();
    let rate = data[fromCurr.value.toLowerCase()];
    let actRate = rate[toCurr.value.toLowerCase()];
    let finalAmount = amtVal * actRate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    updateGraph();
};

document.addEventListener("DOMContentLoaded", function () {
    const inputDate = document.getElementById("inputDate");
    const today = new Date().toJSON().split('T')[0];
    inputDate.value = inputDate.max = today;
    inputDate.min = "2024-03-02";
    flatpickr("#inputDate", {
        minDate: "2024-03-02",
        maxDate: today,
        dateFormat: "Y-m-d"
    });
    updateExchangeRate();
});

const updateGraph = async () => {
    const startDate = "2024-03-02";
    const dates = [];
    let date = startDate;
    dates.push(date);
    const today = new Date().toISOString().split('T')[0];
    while(date !== today) {
        const tempDate = new Date(date);
        tempDate.setDate(tempDate.getDate() + 1);
        date = tempDate.toISOString().split('T')[0];
        dates.push(date);
    }
    const results = await Promise.all(dates.map(date => {
        const URL = `${BASE_URL}${date}/v1/currencies/${fromCurr.value.toLowerCase()}.json`;
        return fetch(URL)
            .then(res => res.json())
            .then(data => data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()])
            .catch(() => null);
    }));
    const arr = results.filter(rate => rate !== null);
    console.log(arr);
    Plotly.newPlot('plot', [{
        x: dates,
        y: arr,
        type: 'line'
    }], {
        width: 800,
        height: 400,
        title: 'Currency Exchange Rate Trend'
    }).then(() => {
        document.querySelector(".container").style.display = "block";
    });
};