const cheerio = require("cheerio");
const axios = require("axios");
let fs = require('fs');
let content = fs.readFileSync('myhotels.json','utf-8');
data = JSON.parse(content);
let HotelsDetail = [];

data.forEach(element => {
    
    const baseUrl = element.url;
    gethotelDetail(baseUrl);

});

async function gethotelDetail(baseUrl) {
    axios
      .get(baseUrl)
      .then((response) => {
        let $ = cheerio.load(response.data);
        $(".pp-cleanup").each(function (el, index) {
          let title = $(this).find("h2.pp-header__title").text();
          let rating = $(this).find("div.b5cd09854e").text().trim().slice(0,3);
          let roomsType = $(this).find("span.hprt-roomtype-icon-link ").text().trim().split('\n');
          let PriceTag = $(this).find("span.prco-valign-middle-helper").text().trim().split('\n');
          HotelsDetail.push({Title: title, Rating: rating, RoomType : roomsType, Price : PriceTag});
        });

        console.log(HotelsDetail);
      })
      .catch((error) => {
        console.log(error);
      });
  }