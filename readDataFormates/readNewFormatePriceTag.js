const cheerio = require("cheerio");
const axios = require("axios");
let fs = require('fs');
const { Type } = require("selenium-webdriver/lib/logging");
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

            let roomsType = [];
            $('#hprt-table tr').each(function(){
                    let TypeR = $(this).find("span.hprt-roomtype-icon-link ").text().trim().split('\n');
                    //let sleeps = $(this).find("span.bui-u-sr-only").text().trim().split('\n');
                    let PriceTag = $(this).find("span.bui-u-sr-only").text().trim().split('\n');
                    //span.prco-valign-middle-helper
                    let rooms = {
                        type : TypeR,
                        //Persons : sleeps,
                        price : PriceTag
                    }
                    roomsType.push(JSON.stringify(rooms));
            })











          HotelsDetail.push({
            Title: title, 
            Rating: rating, 
            RoomType :roomsType});
        });

        console.log(HotelsDetail);
      })
      .catch((error) => {
        console.log(error);
      });
  }