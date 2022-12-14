//***************************************************
// this code runs and gives you total paginated data of the url


const cheerio = require("cheerio");
const axios = require("axios");
const chalk = require("chalk");
let offset = 0
const url = 
          `https://www.booking.com/searchresults.en-us.html?ss=Swat&dest_id=900055706&checkin=2022-11-27&checkout=2022-11-30&group_adults=2&no_rooms=1&group_children=0&offset=${offset}`;

let hotels = [];
let resultCount = 0;


async function gethotels(url) {
  axios
    .get(url)
    .then((response) => {
      let $ = cheerio.load(response.data);
      $(".d20f4628d0").each(function (el, index) {
        let title = $(this).find("div.fcab3ed991").text();
        let price = $(this).find("span.fcab3ed991 ").text();
        let url = $(this).find('a').attr('href');
        const count = resultCount++;
        hotels.push({ count: count , title: title, url: url });
      });

      while(offset<100){
        offset = offset + 25;
        //console.log(url);
        baseurl = `https://www.booking.com/searchresults.en-us.html?ss=Swat&dest_id=900055706&checkin=2022-11-27&checkout=2022-11-30&group_adults=2&no_rooms=1&group_children=0&offset=${offset}`;
        console.log(baseurl);
        gethotels(baseurl);
      }
    

      console.log(hotels);
    })
    .catch((error) => {
      console.log(error);
    });
}
gethotels(url);
