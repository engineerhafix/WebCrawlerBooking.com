const cheerio = require("cheerio");
const axios = require("axios");
const chalk = require('chalk');
let fs = require('fs');
//reading data from the json file
let content = fs.readFileSync('swat.json','utf-8');
data = JSON.parse(content);

const outputFile = 'SwatHotelsDetailedData_final.json';
let HotelsDetail = [];

// function to collect URL of each element in a data and then internally calls the getHotelDetail Function for gathering Details
data.forEach(element => {
    
    const baseUrl = element.url;
    getHotelDetail(baseUrl);

});


async function getHotelDetail(baseUrl) {
    axios
      .get(baseUrl)
      .then((response) => {
        let $ = cheerio.load(response.data);
        // taking up the entire data of a grid
        $(".pp-cleanup").each(function (el, index) {
          let title = $(this).find("h2.pp-header__title").text();
          let rating = $(this).find("div.b5cd09854e").text().trim().slice(0,3);
          let propertyDescription = $(this).find("div#property_description_content").text();
          let PropertyHighlights = $(this).find("div.property-highlights").text().trim().split('\n');
          let HotelAnimities = $(this).find("div.hotel-facilities__list").text().trim().split('\n');
          let GuestReviews = $(this).find('div.bui-spacer--larger').find('div.d46673fe81').text().trim().split('\n');
          //console.log(GuestReviews);

           
            // call the function to remove the spaces from the Array
            PropertyHighlights = PropertyHighlights.filter(removeSpace);
            // splice out the last 4 items 
            PropertyHighlights = PropertyHighlights.splice(0 , PropertyHighlights.length-4);
            HotelAnimities = HotelAnimities.filter(removeSpace);
        
          // going inside for each room deatails
            let roomsType = [];
            $('#hprt-table tr').each(function(){
                    let Type = $(this).find("span.hprt-roomtype-icon-link ").text().trim().split('\n');
                    let sleeps = $(this).find("span.bui-u-sr-only").text().trim().split('\n');
                    let BedType = $(this).find("div.bed-types-wrapper").text().trim().split('\n');
                    let Aminities = $(this).find("div.hprt-facilities-block").text().trim().split('\n');

                    TypeR = TypeR.filter(removeSpace);
                    sleeps = sleeps.filter(removeSpace);
                    BedType = BedType.filter(removeSpace);
                    Aminities = Aminities.filter(removeSpace);
                    
                      let rooms = {
                        type : Type,
                        Persons : sleeps,
                        BedType: BedType,
                        Aminities: Aminities
                       
                    }

                    //pushing details of a room into types   
                    roomsType.push(rooms);
                   
            })

            // pushing details into Hotel array of each hotel    
            HotelsDetail.push({
                Hotel_Title: title, 
                Hotel_Rating: rating,
                Property_Description :  propertyDescription,
                Property_Highlights : PropertyHighlights,
                Guests_reviews : GuestReviews,
                Room_Types :roomsType,
                Hotel_Animities : HotelAnimities
             });


            //function to remove spaces and empty items in an array
            function removeSpace(e) {
                return e === 0 || e;
            }
        });

       exportResults(HotelsDetail);
       //console.log(HotelsDetail);
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
      console.log(chalk.yellow.bgBlue(`${chalk.underline.bold(parsedResults.length)} Results exported successfully to ${chalk.underline.bold(outputFile)}`))
    })
  }