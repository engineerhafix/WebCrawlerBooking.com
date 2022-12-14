//***************************************************
// this code is fully working and this code is responsible for exporting all the hotels from a particular url


const cheerio = require("cheerio");
const axios = require("axios");
const fs = require('fs');
const chalk = require('chalk');
let offset = 0
const url = `https://www.booking.com/searchresults.en-us.html?ss=Swat&dest_id=900055706&checkin=2022-12-27&checkout=2022-12-28&group_adults=2&no_rooms=1&group_children=0&offset=${offset}`;

let hotels = [];
let resultCount = 0;
const outputFile = './swat.json'


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

      while(offset<500){
        offset = offset + 25;
        //console.log(url);
        baseurl = `https://www.booking.com/searchresults.en-us.html?ss=Swat&dest_id=900055706&checkin=2022-12-27&checkout=2022-12-28&group_adults=2&no_rooms=1&group_children=0&offset=${offset}`;
       
        //console.log(baseurl);
        gethotels(baseurl);
      }
    
      exportResults(hotels)
      //console.log(hotels);
    })
    .catch((error) => {
      console.log(error);
    });

    //exportResults(hotels);
}
const exportResults = (parsedResults) => {
  fs.writeFile(outputFile, JSON.stringify(parsedResults , null, 3), (err) => {
    if (err) {
      console.log(err)
    }
    console.log(chalk.yellow.bgBlue(`\n ${chalk.underline.bold(parsedResults.length)} Results exported successfully to ${chalk.underline.bold(outputFile)}\n`))
  })
}

gethotels(url);
