const fs = require('fs');
const APIKey = fs.readFileSync('/home/shane/dev/apikeys/apikey.txt').toString()

$("#textarea").keydown(function(){
    if (event.keyCode == 14){
        weatherfetch();
        forecastfetch();
    }
});


// CURRENT WEATHER SECTION //

function getdate() {
    var days = ['Sun','Mon','Tues','Wed','Thur','Fri','Sat'];
    var months = ['Jan','Feb','Mar','April','May','June','July','Aug','Sept','Oct','Nov','Dec'];
    var dt = new Date();
    var day = days[dt.getDay()];
    var month = months[dt.getMonth()];
    var date = dt.getDate();
    var year = dt.getFullYear();
    var fulldate = day+' '+month+'. '+date+', '+year;
    return fulldate;
}

function weatherfetch(){
    var api_key = APIKey;
    var city = $('#textarea').val();
    var url1 = 'https://api.openweathermap.org/data/2.5/weather?q='+city;
    var url2 = ',us&units=imperial&appid='+api_key;
    $.ajax({
        dataType: 'json',
        url: url1+url2,
        success: function(result,status,xhr){
          console.log(result);
            var city = result['name'];
            var temp = Math.round(result['main']['temp']);
            var temp_max = Math.round(result['main']['temp_max']);
            var temp_min = Math.round(result['main']['temp_min']);
            var date = getdate();
            var conditions = result['weather'][0]['description'];
            var humid = result['main']['humidity'];
            var wind = Math.round(result['wind']['speed']);
           
            $('#city').html(city);
            $('#temp').html(temp+' °F');
            $('#temp_max').html(temp_max+' °F');
            $('#temp_min').html(temp_min+' °F');
            $('#date').html(date);
            $('#conditions').html(conditions);
            $('#wind').html('Wind: '+wind+'MPH');
            $('#humid').html('Humidity: '+humid+'%');
            bgfetch(conditions);
        },
        error: function () {
            alert("Error:\nPlease check to ensure city name is valid and there is a connection to the internet");
        },
    });
}

function bgfetch(conditions){
    var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
    var spaceRE = /\s+/g;
    var conditions = conditions.replace(punctRE, '').replace(spaceRE, ' ');
    var tSplit = conditions.split(" ");
    var snowy = ['snow','snowy'];
    var sunny = ['sun','sunny','clear'];
    var cloudy = ['clouds','cloudy'];
    var rainy = ['rain','rainy','mist'];
    var stormy = ['storm','storms','stormy'];
    var hazy = ['haze','hazy'];

    var arr1 = tSplit.filter((i) => snowy.includes(i));
        if (arr1 != ""){
            $('body').css('background-image','url("../pics/snow3.gif")');
            $('#temp').append('  <i class="fas fa-snowflake"></i>');
    }
    var arr2 = tSplit.filter((i) => sunny.includes(i));
        if (arr2 != ""){
            $('body').css('background-image','url("../pics/sun.gif")');
            $('#temp').append('  <i class="fas fa-sun"></i>');
    }
    var arr3 = tSplit.filter((i) => cloudy.includes(i));
        if (arr3 != ""){
            $('body').css('background-image','url("../pics/clouds.gif")');
            $('#temp').append('  <i class="fas fa-cloud"></i>');
    }
    var arr4 = tSplit.filter((i) => rainy.includes(i));
        if (arr4 != ""){
            $('body').css('background-image','url("../pics/rain.gif")');
            $('#temp').append('  <i class="fas fa-cloud-showers-heavy"></i>');
    }
    var arr5 = tSplit.filter((i) => stormy.includes(i));
        if (arr5 != ""){
            $('body').css('background-image','url("../pics/storm.gif")');
            $('#temp').append('  <i class="fas fa-poo-storm"></i>');
    }
    var arr6 = tSplit.filter((i) => hazy.includes(i));
        if (arr6 != ""){
            $('body').css('background-image','url("../pics/haze.png")');
            $('#temp').append('  <i class="fas fa-cloud-meatball"></i>');
    }
}


//   FORECAST SECTION   //

function forecastfetch(){
    var api_key = 'bc1b7157c79434068d3e1725fd1504ed';
    var city = $('#textarea').val();
    var url1 = 'https://api.openweathermap.org/data/2.5/forecast';
    var url2 = '?q='+city+',us&units=imperial&appid='+api_key;
    $.ajax({
        dataType: 'json',
        url: url1+url2,
        success: function(result){
            var tomorrow = new Date().getDate()+1;
            for(i=0;i<39;i++) {
                var future = result['list'][i]['dt_txt'].slice(8,10);
                if(tomorrow <= future && future < tomorrow + 1) {
                    day1(result,i);
                }
                else if(tomorrow <= future && future < tomorrow + 2) {
                    day2(result,i);
                }
                else if(tomorrow <= future && future < tomorrow + 3) {
                    day3(result,i);
                }
                else if(tomorrow <= future && future < tomorrow + 4) {
                    day4(result,i);
                }
            $('.day1,.day2,.day3,.day4').css('background-color', 'rgba(255,255,255,0.3');
            }
        },
    });
}

function futuredates(result, i, x) {
    var days = ['Sun','Mon','Tues','Wed','Thur','Fri','Sat','Sun','Mon','Tues','Wed'];
    var x = new Date().getDay()+x;
    var y = result['list'][i]['dt_txt'].slice(8,10);
    return(days[x]+' '+y);

}

function day1(result,i) {
    var time = result['list'][i]['dt_txt'].slice(11,13);
    if(time == '06') {
        var x = 1;
        $('#day1_date').html(futuredates(result, i, x));
        var day_desc = result['list'][i]['weather'][0]['description']
        $('day1_desc').append(dayicons(result,i,day_desc,x));
        var day1_low = 'Low: '+Math.round(result['list'][i]['main']['temp'])+' °F'
        $('#day1_low').html(day1_low);
    }
    else if(time == '15') {
        var day1_high = 'High: '+Math.round(result['list'][i]['main']['temp'])+' °F'
        $('#day1_high').html(day1_high);
    }
}

function day2(result,i) {
    var time = result['list'][i]['dt_txt'].slice(11,13)
    if(time == '06') {
        var x = 2;
        $('#day2_date').html(futuredates(result, i, x));
        var day_desc = result['list'][i]['weather'][0]['description']
        $('day2_desc').append(dayicons(result,i,day_desc,x));
        var day2_low = 'Low: '+Math.round(result['list'][i]['main']['temp'])+' °F'
        $('#day2_low').html(day2_low);
    }
    else if(time == '15') {
        var day2_high = 'High: '+Math.round(result['list'][i]['main']['temp'])+' °F'
        $('#day2_high').html(day2_high)
    }
}

function day3(result,i) {
    var time = result['list'][i]['dt_txt'].slice(11,13)
    if(time == '06') {
        var x = 3
        $('#day3_date').html(futuredates(result, i, x))
        var day_desc = result['list'][i]['weather'][0]['description']
        $('day3_desc').append(dayicons(result,i,day_desc,x))
        var day3_low = 'Low: '+Math.round(result['list'][i]['main']['temp'])+' °F'
        $('#day3_low').html(day3_low)
    }
    else if(time == '15') {
        var day3_high = 'High: '+Math.round(result['list'][i]['main']['temp'])+' °F'
        $('#day3_high').html(day3_high)
    }
}

function day4(result,i) {
    var time = result['list'][i]['dt_txt'].slice(11,13)
    if(time == '06') {
        var x = 4
        $('#day4_date').html(futuredates(result, i, x))
        var day_desc = result['list'][i]['weather'][0]['description']
        $('day4_desc').append(dayicons(result,i,day_desc,x))
        var day4_low = 'Low: '+Math.round(result['list'][i]['main']['temp'])+' °F'
        $('#day4_low').html(day4_low)
    }
    else if(time == '15') {
        var day4_high = 'High: '+Math.round(result['list'][i]['main']['temp'])+' °F'
        $('#day4_high').html(day4_high)
    }
}

function dayicons(result,i,day_desc,x){
    var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
    var spaceRE = /\s+/g;
    var day_desc = day_desc.replace(punctRE, '').replace(spaceRE, ' ');
    var tSplit = day_desc.split(" ");
    var snowy = ['snow','snowy']
    var sunny = ['sun','sunny','clear']
    var sclouds = ['scattered clouds']
    var cloudy = ['clouds','cloudy']
    var rainy = ['rain','rainy']
    var stormy = ['storm','storms','stormy']
    var hazy = ['haze','hazy']

    var arr1 = tSplit.filter((i) => snowy.includes(i));
        if (arr1 != ""){
            $('#day'+[x]+'_desc').html('  <i class="fas fa-snowflake"></i>');
    }
    var arr2 = tSplit.filter((i) => sunny.includes(i));
        if (arr2 != ""){
            $('#day'+[x]+'_desc').html('  <i class="fas fa-sun"></i>');
    }
    var arr3 = tSplit.filter((i) => cloudy.includes(i));
        if (arr3 != ""){
            $('#day'+[x]+'_desc').html('  <i class="fas fa-cloud"></i>');
    }
    var arr4 = tSplit.filter((i) => rainy.includes(i));
        if (arr4 != ""){
            $('#day'+[x]+'_desc').html('  <i class="fas fa-cloud-showers-heavy"></i>');
    }
    var arr5 = tSplit.filter((i) => stormy.includes(i));
        if (arr5 != ""){
            $('#day'+[x]+'_desc').html('  <i class="fas fa-poo-storm"></i>');
    }
    var arr6 = tSplit.filter((i) => hazy.includes(i));
        if (arr6 != ""){
            $('#day'+[x]+'_desc').html('  <i class="fas fa-cloud-meatball"></i>');
    }
    var arr7 = tSplit.filter((i) => sunny.includes(i));
        if (arr7 != ""){
            $('#day'+[x]+'_desc').html('  <i class="fas fa-cloud-sun"></i>');
    }
}
