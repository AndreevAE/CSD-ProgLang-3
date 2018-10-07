/*
Необходимо написать скрипт, генерирующий html страницу с списком мероприятий
(событий) связанных с IT полученных с сайта https://www.meetup.com/meetup_api/.
Необходимо заранее зарегистироваться и получить ключ для доступа апи.

В скрипте константами задаете город(любой, где много событий, напр. Boston).
Диапазон дат вычисляется автоматически в виде следующей недели относительно
времени запуска скрипта.

Необходимо вывести вывести на каждый день недели список событий в виде даты,
заголовка, адреса и аннотации.
Для фильтрации тематики используйте ключевые слова.

Базовый язык - Javascript. Допускается реализация как под node.js, так и в виде
скрипта в браузере.

Варианты задания:

 Meetup vs Eventbrite
Last - top 50 events, top 20 City; Future - Events in city next week, Events
per topic for specific date in N km around
Node.js vs console (контекст источника)
Первую реализацию требуется сдать до 23:55 (UTC+7) 25 Ноября. Реализацию на
втором языке требуется сдать до 23:55 (UTC+7) 9 Декабря.
*/

function setDayOfWeek(date, dayOfWeek) {
  date = new Date(date.getTime());
  date.setDate(date.getDate() + (dayOfWeek + 8 - date.getDay()) % 8);
  return date;
}

function getFormattedDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return year + '-' + month + '-' + day;
}

// api params
let apiKey = "512c58118e11191e34367c6c5a3036";
let lon = "-71.06999969482422";
let lat = "42.36000061035156";
// let start_date_range = "2018-10-08T00:00:00";
// let end_date_range = "2018-10-14T00:00:00";
let topic_category = "1516324";
let page = "20";
let order = "best";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let date = new Date();
let body = document.getElementsByTagName('body')[0];
body.innerText = "";
var request = new Array();
var query = new Array();
for (i = 1; i <= 7; ++i) {
  (async function(i) {
    let currentDate = setDayOfWeek(date, i);
    let start_date_range = getFormattedDate(currentDate) + "T00:00:00";

    let nextDate = setDayOfWeek(date, i + 1);
    let end_date_range = getFormattedDate(nextDate) + "T00:00:00";

    query[i] = "https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public"
      + "&lon=" + lon
      + "&lat=" + lat
      + "&start_date_range=" + start_date_range
      + "&end_date_range=" + end_date_range
      + "&topic_category=" + topic_category
      + "&page=" + page
      + "&order=" + order
      + "&key=" + apiKey;

    request[i] = new XMLHttpRequest();
    request[i].open("GET", query[i], true);
    request[i].onreadystatechange = function (oEvent) {
      if (request[i].readyState === 4) {
        body.innerText += "================" + "\n"
                        + currentDate.toDateString()
                        + "\n" + "================" + "\n";
        if (request[i].status === 200) {
          response = JSON.parse(request[i].response);
          let events = response.events;
          events.forEach( (event) => {
            body.innerText += event.local_time + " " + event.local_date + "\n"
              + event.name + "\n"
              + event.group.localized_location + "\n"
              + event.description + "\n\n";
          })
        } else {
          console.log("Error", request[i].statusText);
        }
      }
    };
    request[i].send();
  })(i);
}
