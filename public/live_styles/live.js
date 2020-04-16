
//Variable initialiazation
var table=document.querySelector("#t1");
var table1=document.querySelector("#t2");
var input=document.getElementById("search");
var search=document.getElementById("searching");
var toggle=document.getElementById("toggle");
var charts=document.getElementById("charts");
var searchdiv=document.getElementById("searchon");
var table3=document.getElementById("table3");
console.log(input);
var tabledata=[];
var table1data=[];
var timedata=[];
var countrypoints=[];

window.onload = function() {
    var dataPoints = [];
  //Generating points for indian Histogram
    function getDataPointsFromCSV(json) {

        for (var i = 0; i < json.statewise.length; i++)
            { if(parseFloat(json.statewise[i].active)>0)
              {
                dataPoints.push({
                    y: parseFloat(json.statewise[i].active),
                    label: json.statewise[i].state
                });
              }

            }

        return dataPoints;
    }
//Api call for indian histogram and rendering the chart
jQuery.get("https://api.covid19india.org/data.json", function(data) {
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled:true,
    dataPointWidth:5,
    theme:"light2",
    axisX:{
      interval:1,
      labelAngle:-70,
      title:"State"
    },
    axisY:{
      title:"Cases",
    },
    title: {
         text: "Current Status",
    },
    options:{
      responsive:true
    },
    data: [{
         type: "column",
         dataPoints: getDataPointsFromCSV(data)
      }]
   });

    chart.render();
    //chart.set("dataPointWidth",Math.ceil(chart.axisX[0].bounds.width/chart.data[0].dataPoints.length),true);
});

}
//Dynamically Generating Table
function generatetable(table1,tabledata1)
{ var tableHeaderRowCount = 1;
  var rowCount = table1.rows.length;
for (var i = tableHeaderRowCount; i < rowCount; i++) {
    table1.deleteRow(tableHeaderRowCount);
}
  for(var i=0;i<tabledata1.length;i++)
 {
     var row=table1.insertRow();
     for(var key in tabledata1[i])
   { var cell=row.insertCell();
     var text=document.createTextNode(tabledata1[i][key]);
     cell.appendChild(text);
   }
 }
}

//Api call for Generating Indian table
jQuery.get("https://api.rootnet.in/covid19-in/stats/latest", function(data) {
     filltabledata(data);
    //chart.set("dataPointWidth",Math.ceil(chart.axisX[0].bounds.width/chart.data[0].dataPoints.length),true);
});
//Api call for generating world table
$.get("https://corona.lmao.ninja/all",function(data){
  filltabledata1(data);
})
//Api call to get world data
$.get("https://pomber.github.io/covid19/timeseries.json",function(data){
  for(var i in data)
  { var name=i;
    timedata.push({country: i,
      data: data[i]});
  }
  console.log(timedata);
});
//function to create array suitable for indian table Data
function filltabledata(file)
{
  var data=file.data;
  for(var i=0;i<data.regional.length;i++)
  {
    tabledata.push({
      state:data.regional[i].loc,
      current:parseFloat(data.regional[i].totalConfirmed),
      dischared:data.regional[i].discharged,
      deaths:data.regional[i].deaths,


    });
  }
  tabledata.push({

      state:"Total",
      current:data.summary.total,
      discharged:data.summary.discharged,
      deaths:data.summary.deaths

  });
//function to generate world table data array
 generatetable(table,tabledata);
}
function filltabledata1(data)
{
   table1data.push(
     {
       Active:data.cases,
        Recent:data.todayCases,
        RecentDeaths:data.todayDeaths,
        TotalDeaths:data.deaths,
        Critical:data.critical,
        countries:data.affectedCountries
     }

   );
  generatetable(table1,table1data);
}
//searching and generating the chart and table
search.addEventListener("click",function(){
  ser(input.value);
});
function ser(text)
{ var counter=0;
  for(var i=0;i<timedata.length;i++)
  {
    if(text.toLowerCase() === timedata[i].country.toLowerCase() ||  text === timedata[i].country)
    {
      console.log(timedata[i]);
      if(!document.getElementById("error").classList.toggle("notfound"))
      {
        document.getElementById("error").classList.toggle("notfound");
      }
      createdataset(timedata[i].data);
      break;
    }
    counter++;
  }
  if(counter == timedata.length)
  {
   if(document.getElementById("error").classList.toggle("notfound"))
   {
     document.getElementById("error").classList.toggle("notfound");
   }
  }
}
function createdataset(data)
{ var counter=1;
  countrypoints=[];
  console.log(data);


  for(var i=0;i<data.length;i++)
  {
    if(parseFloat(data[i].confirmed)>0)
    {

      countrypoints.push(
        {
          x:new Date(data[i].date),
          y:parseFloat(data[i].confirmed),
          label:data.date
        }
      );
      counter++;
    }
  }
  console.log(countrypoints);

  generatetable(table3,data.reverse());
  if(!document.getElementById("livechart").classList.contains("countrychart"))
  {
    document.getElementById("livechart").classList.toggle("countrychart");
  }
  if(document.getElementById("ctoff").classList.contains("table3off")){

    document.getElementById("ctoff").classList.toggle("table3off");
  }
  var chart1=new CanvasJS.Chart("livechart",{
    animationEnabled:true,
    theme:"light2",
    axisX:{
      title:"Day"
    },
    axisY:{
      title:"Active cases"
    },
    title:{
      text:"Date wise status",
    },
    options:{
      responsive:true
    },
    data:[{
      type:"line",
      dataPoints:countrypoints
    }]
  });

   chart1.render();




}

toogle.addEventListener("click",function(){
   charts.classList.toggle("togglesearch");
   searchdiv.classList.toggle("togglesearch");
});
