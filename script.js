const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

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
    });
}

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
    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
    let response = await fetch(URL);
    let data = await response.json();
    let rate = data[fromCurr.value.toLowerCase()];
    let actRate = rate[toCurr.value.toLowerCase()];
    let finalAmount = amtVal * actRate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`
};
