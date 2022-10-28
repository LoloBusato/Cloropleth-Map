const educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let educationData
let countyData

let canvas = d3.select("#canvas")

function drawMap() {

  let tooltip = d3.select("body")
                                .append("div")
                                .attr("id", "tooltip")
                                .style("visibility", "hidden")
                                .style("position", "absolute");

  canvas.selectAll("path")
        .data(countyData)
        .enter()
        .append("path")
        .attr("d", d3.geoPath())
        .attr("class","county")
        .attr("fill", (d) => {
          let id = d.id
          let county = educationData.find((item) => {
            return item["fips"] === id
          })
          let percentage = county["bachelorsOrHigher"]
          if (percentage >= 50) {
            return "green"
          } else if (percentage >= 40 && percentage < 50) {
            return "lightgreen"
          } else if (percentage >= 20 && percentage < 40) {
            return "red"
          } else {
            return "brown"
          }
        })
        .attr("data-fips",(d) => {
          return d.id
        })
        .attr("data-education",(d) => {
          let id = d.id
          let county = educationData.find((item) => {
            return item["fips"] === id
          })
          return county["bachelorsOrHigher"]
        })
        .on("mouseover", (event, d) => {
                    tooltip
                      .html("")
                      .style('visibility', 'visible')
                      .style('top', event.pageY - 50 + 'px')
                      .style('left', event.pageX + 20 + 'px');
                    let id = d["id"]
                    let county = educationData.find((item) => {
                      return item["fips"] === id
                    })
                    tooltip.append('h4').text(county["area_name"]);
                    tooltip.append('h5').text("Percentage: " + county["bachelorsOrHigher"]);
                    tooltip.attr("data-education", county["bachelorsOrHigher"])
                  })
          .on("mouseout", function() {
            tooltip.style('visibility', 'hidden');
          });;

const legendInfo = [
  {text: "Less than 20%", color: "brown"},
  {text: "20% than 40%", color: "red"},
  {text: "40% than 50%", color: "lightgreen"},
  {text: "More than 50%", color: "green"},
]

   let legend = d3.select("#legend")
   const g = legend.selectAll("g")
                   .data(legendInfo)
                   .enter()
                   .append("g")

    g.append("rect")
     .attr("x", (d,i) => i * 140)
     .attr("y","20")
     .attr("width","140")
     .attr("height","40")
     .attr("fill",(d) => d["color"])

    g.append("text")
     .attr("x",(d,i) => i * 140)
     .attr("y", "80")
     .text((d) => d["text"])

}

d3.json(countyURL).then(
  (data, error) => {
    if(error) {
      console.log(error)
    } else {
      countyData = topojson.feature(data, data.objects.counties).features
      console.log(countyData)

      d3.json(educationURL).then(
        (data, error) => {
          if (error) {
            console.log(error)
          } else {
            educationData = data
            console.log(educationData)
            drawMap()


          }
        }
      )
    }
  }
)
