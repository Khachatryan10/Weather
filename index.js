import apiKey from "./apikey.js"

"use strict";

let h1 = document.getElementById("hd1")
let input = document.getElementById("input")
let button = document.getElementById("btn")
let h2 = document.getElementById("hd2")
let div = document.getElementById("Textcontainer")
let video = document.getElementById("video")
let dtContainers = document.querySelectorAll(".dtContainers"),d;
let todayDtContainers = document.querySelectorAll(".todayContainers"),t;
let nexDaysContainer = document.querySelectorAll(".nextdaysContainers"),n;
let hdContainer = document.getElementById("hdContainer")

let prg1 = document.getElementById("prg1")
let prg2 = document.getElementById("prg2")
let prg3 = document.getElementById("prg3")
let prg4 = document.getElementById("prg4")
let prg5 = document.getElementById("prg5")
let prgs = document.querySelectorAll(".tdPrg"),p;
let day
let inputRgHumidity = document.getElementById("inputRgHumidity")
let inputRangeVis = document.getElementById("inputRangeVis")
let nextDayPrgs = document.querySelectorAll(".nxPrg"),np;
let weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

let dataSetOption = document.getElementById("option")


async function display(){
if (input.value !== ""){
video.style.border = "1px dashed white"
video.style.opacity = "0.50"
await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${input.value}&appid=${apiKey}`,{
    method: "GET"
})
            .then((res) => res.json())
            .then((data) =>  {
            
                data.forEach(async function(elem){

                if (input.value.toLowerCase() !== elem.name.toLowerCase()){
                    input.value = elem.name
                }
                
                else{
                    input.value = elem.name[0].toUpperCase() + elem.name.slice(1)
                }
                
                    await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${elem.lat}&lon=${elem.lon}&appid=${apiKey}&units=metric`,{
                        method: "GET"
                    })
                    .then((res2) => res2.json())
                    .then((result) => {
                    video.style.border = ""
                    video.style.opacity = ""
                        if (result.sys.country === undefined){
                            h1.innerHTML = `NOW ${JSON.stringify(Math.round(result.main.temp))} °C <br> in ${elem.name}`
                        }
                        
                        else{
                            h1.innerHTML = `NOW ${JSON.stringify(Math.round(result.main.temp))} °C <br> in ${elem.name}/${result.sys.country}`
                        }
                                inputRgHumidity.value = JSON.stringify(result.main.humidity) ,
                                prg1.innerHTML = `Humidity <br> ${JSON.stringify(result.main.humidity)}%`,
                                prg2.innerHTML = `Visibilty <br> ${result.visibility / 1000} km`,
                                inputRangeVis.value = result.visibility / 1000,
                                prg3.innerHTML = `Feels Like <br> ${Math.round(result.main.feels_like)} °C`,
                                prg4.innerHTML = `Maximum Temerature <br> ${Math.round(result.main.temp_max)} °C`,
                                prg5.innerHTML = `Minimum Temperature <br>  ${Math.round(result.main.temp_min)} °C`
                        
                        JSON.stringify(result.weather.map(function(i){
                        h2.innerHTML = i.description[0].toUpperCase() + i.description.slice(1)
                        let keyWord = i.description
                        hdContainer.style.display = "block"
                        for (let d = 0; d < dtContainers.length; d++){
                                dtContainers[d].style.display = "block"
                        }
                        
                        for (let t = 0; t < todayDtContainers.length; t++){
                            todayDtContainers[t].style.display = "block"
                        }
                        
                        for (let n = 0; n < nexDaysContainer.length; n++){
                            nexDaysContainer[n].style.display = "block"
                        }

                        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${elem.lat}&lon=${elem.lon}&appid=${apiKey}&units=metric`,{
                            method: "GET"
                        })
                        .then((res3) => res3.json())
                        .then((dayElem) => {
                            let j = -1;

                            for (let p = 0; p < prgs.length; p++){
                            
                                while (j <= 6){
                                    j++
                                    
                                    day = new Date(dayElem.list[j].dt_txt.slice(0,10))
                                        
                                        if (dayElem.list[0].dt_txt.slice(0,10) === dayElem.list[j].dt_txt.slice(0,10)){
                                            prgs[p].innerHTML = `Today <br> ${dayElem.list[j].dt_txt.slice(11,16)} <br> ${Math.round(dayElem.list[j].main.temp)} °C <br> ${dayElem.list[j].weather.map(e =>  e.description[0].toUpperCase() + e.description.slice(1))}`

                                        }
                                        
                                        else{                                
                                            prgs[p].innerHTML = `${weekdays[day.getDay()]} <br> ${dayElem.list[j].dt_txt.slice(11,16)} <br> ${Math.round(dayElem.list[j].main.temp)} °C <br> ${dayElem.list[j].weather.map(e =>  e.description[0].toUpperCase() + e.description.slice(1))}`

                                        }
                                    break;
                                }
                                
                    let g = 0
                    for (let np = 0; np < nextDayPrgs.length; np++){
                        while (g <= 5){
                            g++
                            let TimeOfdays = dayElem.list.filter(el => el.dt_txt.slice(11,16) === "12:00")
                            let nextDays = new Date(TimeOfdays[g].dt_txt.slice(0,10))
                                nextDayPrgs[np].innerHTML = `${weekdays[nextDays.getDay()]} <br> ${Math.round(TimeOfdays[g].main.temp)} °C <br> ${TimeOfdays[g].weather.map(e => e.description[0].toUpperCase() + e.description.slice(1))}`
                            break
                            }
                        }
                    }
                })
                .catch(err => console.log(err))
                            switch(true){
                            
                                case keyWord.includes("clear"):
                                    video.setAttribute("src","https://assets.mixkit.co/videos/preview/mixkit-leaves-under-a-blue-sky-1185-large.mp4")
                                break
                                
                                case keyWord.includes("snow"):
                                    video.setAttribute("src","https://assets.mixkit.co/videos/preview/mixkit-frozen-forest-while-is-snowing-34757-large.mp4")
                                break
                                
                                case keyWord.includes("rain"):
                                    video.setAttribute("src","https://assets.mixkit.co/videos/preview/mixkit-tree-branch-closeup-under-the-rain-6765-large.mp4")
                                break
                                
                                case keyWord.includes("clouds"):
                                    video.setAttribute("src","https://assets.mixkit.co/videos/preview/mixkit-dense-clouds-moving-in-the-sky-9442-large.mp4")
                                break
                                
                                case keyWord.includes("mist"):
                                    video.setAttribute("src","https://assets.mixkit.co/videos/preview/mixkit-fog-across-the-hills-15534-large.mp4")
                                break
                                
                                case keyWord.includes("fog"):
                                    video.setAttribute("src","https://assets.mixkit.co/videos/preview/mixkit-fog-across-the-hills-15534-large.mp4")
                                break
                                
                                case keyWord.includes("thunderstorm"):
                                    video.setAttribute("src","https://assets.mixkit.co/videos/preview/mixkit-lightning-cutting-through-the-clouds-29354-large.mp4")
                                break
                                
                                case keyWord.includes("drizzle"):
                                    video.setAttribute("src","https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-the-water-of-a-lake-seen-up-18312-large.mp4")
                                break
                                
                                case keyWord.includes("sleet"):
                                    video.setAttribute("src","https://assets.mixkit.co/videos/preview/mixkit-dark-clouds-passing-over-a-forest-20233-large.mp4")
                                break
                                case keyWord.includes("smoke"):
                                    video.setAttribute("src","https://assets.mixkit.co/videos/preview/mixkit-panorama-of-a-village-between-hills-full-of-mist-5044-large.mp4")
                                break
                                
                                case keyWord.includes("haze"):
                                    video.setAttribute("src","https://assets.mixkit.co/videos/preview/mixkit-farm-fields-in-an-aerial-view-on-a-cloudy-day-41397-large.mp4")
                                break
                    
                    }
                }))
                
            })
            .catch(err => console.log(err))
        })
    })
    .catch(err => console.log(err))
}
}
    


input.addEventListener("search",display)
input.addEventListener("onchange",() => showOptions())
button.addEventListener("click",display)
