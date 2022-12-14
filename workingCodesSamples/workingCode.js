//***************************************************
const cheerio = require("cheerio");
const axios = require("axios");
const chalk = require("chalk");

const url = 
          "https://www.booking.com/searchresults.en-us.html?ss=Mingora&ssne=Mingora&ssne_untouched=Mingora&label=gen173nr-1FCAEoggI46AdIM1gEaLUBiAEBmAExuAEXyAEP2AEB6AEB-AECiAIBqAIDuAL_6vKbBsACAdICJDA0MjU3ZGNjLTJlOWEtNDMyYi1hNDQ2LTg0MmIwMjczYjMzYtgCBeACAQ&aid=304142&lang=en-us&sb=1&src_elem=sb&src=index&dest_id=-2769132&dest_type=city&checkin=2022-11-25&checkout=2022-11-26&group_adults=2&no_rooms=1&group_children=0&sb_travel_purpose=leisure";

let hotels = [];
const pageLimit = 3;
let pageCounter = 0;
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

        hotels.push({ count: count, title: title, Price: price, url: url });
      });
      // Pagination Elements Link
      const nextPageLink = $(".d493c719bc").find("button");
      console.log(chalk.cyan(`  Scraping : ${nextPageLink}`));
      pageCounter++;


    

      if (pageCounter === pageLimit) {
        //   exportResults(parsedResults)
        console.log(pageCounter);
        return false;
      }
      //gethotels(nextPageLink);
      console.log(hotels);
    })
    .catch((error) => {
      console.log(error);
    });
}
gethotels(url);

//d493c719bc