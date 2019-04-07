import clock from "clock";
import document from "document";
import { today, goals } from "user-activity"
import { preferences } from "user-settings";
import * as util from "../common/utils";
import * as messaging from "messaging";

// Update the clock every minute
clock.granularity = "seconds";

// Get a handle on the <text> element
const digLabel = document.getElementById("digLabel");
let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");
const steps = document.getElementById("steps");
const day = document.getElementById("day");
const date = document.getElementById("date");
let watchFace = document.getElementsByClassName("watchFace");
let extraInfo = document.getElementsByClassName("extraInfo");

let weekNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

let background = document.getElementById("background");

// Message is received
messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);
  if (evt.data.key === "color" && evt.data.newValue) {
    let color = JSON.parse(evt.data.newValue);
    
    watchFace.forEach(function(item,index){
      item.style.fill = color;
    });
  }
  if (evt.data.key === "extraInfo"){
    if(evt.data.newValue === "true"){
      extraInfo.forEach(function(item,index){
        item.style.visibility = "hidden"
      });
    }
    else{
      extraInfo.forEach(function(item,index){
        item.style.visibility = "visible"
      });
    }
  }
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("App Socket Closed");
};

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}

function digitalWatchUpdate(evt){
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  digLabel.text = `${hours}:${mins}`;
}

function analogWatchUpdate(evt){
  let today = evt.date;
  let hours = today.getHours() % 12;
  let mins = today.getMinutes();
  let secs = today.getSeconds();

  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins);
  secHand.groupTransform.rotate.angle = secondsToAngle(secs);
}

function updateSteps(){
  steps.text = today.adjusted.steps;
}

function updateDay(evt){
  let today = (evt && evt.date);
  date.text = `${today.getMonth()+1}/${today.getDate()}`
  day.text = weekNames[today.getDay()];
}

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  digitalWatchUpdate(evt);
  analogWatchUpdate(evt);
  updateSteps();
  updateDay(evt);
}
