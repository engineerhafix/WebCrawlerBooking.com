//***************************************************
// this code is fully working export name and url of a particular hotel


const cheerio = require("cheerio");
const axios = require("axios");
const fs = require('fs');
const chalk = require('chalk');
let offset = 0
const url = 
  // Lahore `https://www.booking.com/searchresults.en-us.html?ss=lahore&ssne=Islamabad&ssne_untouched=Islamabad&label=gen173nr-1FCAEoggI46AdIM1gEaLUBiAEBmAExuAEXyAEP2AEB6AEB-AECiAIBqAIDuALP1vibBsACAdICJGE5ZWRlNDY4LTZiNDItNGY5OC04MDcyLTYwY2QzMGQ1NzcyY9gCBeACAQ&aid=304142&lang=en-us&sb=1&src_elem=sb&src=searchresults&checkin=2022-11-27&checkout=2022-11-30&group_adults=2&no_rooms=1&group_children=0&offset=${offset}`;
  //Islamabad
  `https://www.booking.com/searchresults.en-us.html?ss=Islamabad%2C+Pakistan&ssne=Mingora&ssne_untouched=Mingora&label=gen173nr-1FCAEoggI46AdIM1gEaLUBiAEBmAExuAEXyAEP2AEB6AEB-AECiAIBqAIDuALP1vibBsACAdICJGE5ZWRlNDY4LTZiNDItNGY5OC04MDcyLTYwY2QzMGQ1NzcyY9gCBeACAQ&aid=304142&lang=en-us&sb=1&src_elem=sb&src=index&checkin=2022-11-27&checkout=2022-11-30&group_adults=2&no_rooms=1&group_children=0&offset=${offset}`;
  // mingora  `https://www.booking.com/searchresults.en-us.html?ss=Swat&dest_id=900055706&checkin=2022-11-27&checkout=2022-11-30&group_adults=2&no_rooms=1&group_children=0&offset=${offset}`;

let hotels = [];
let resultCount = 0;
const outputFile = 'Islamabad.json';


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
        baseurl = // Lahore `https://www.booking.com/searchresults.en-us.html?ss=lahore&ssne=Islamabad&ssne_untouched=Islamabad&label=gen173nr-1FCAEoggI46AdIM1gEaLUBiAEBmAExuAEXyAEP2AEB6AEB-AECiAIBqAIDuALP1vibBsACAdICJGE5ZWRlNDY4LTZiNDItNGY5OC04MDcyLTYwY2QzMGQ1NzcyY9gCBeACAQ&aid=304142&lang=en-us&sb=1&src_elem=sb&src=searchresults&checkin=2022-11-27&checkout=2022-11-30&group_adults=2&no_rooms=1&group_children=0&offset=${offset}`;
        //islamabad
        `https://www.booking.com/searchresults.en-us.html?ss=Islamabad%2C+Pakistan&ssne=Mingora&ssne_untouched=Mingora&label=gen173nr-1FCAEoggI46AdIM1gEaLUBiAEBmAExuAEXyAEP2AEB6AEB-AECiAIBqAIDuALP1vibBsACAdICJGE5ZWRlNDY4LTZiNDItNGY5OC04MDcyLTYwY2QzMGQ1NzcyY9gCBeACAQ&aid=304142&lang=en-us&sb=1&src_elem=sb&src=index&checkin=2022-11-27&checkout=2022-11-30&group_adults=2&no_rooms=1&group_children=0&offset=${offset}`;
        // mingora `https://www.booking.com/searchresults.en-us.html?ss=Swat&dest_id=900055706&checkin=2022-11-27&checkout=2022-11-30&group_adults=2&no_rooms=1&group_children=0&offset=${offset}`;
        
        console.log(baseurl);
        gethotels(baseurl);
      }
    
      exportResults(hotels)
      //console.log(hotels);
    })
    .catch((error) => {
      console.log(error);
    });

  
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
