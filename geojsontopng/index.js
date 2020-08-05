const {createConverter} = require("convert-svg-to-png");
const path = require("path");
const sharp = require('sharp');
const D3Node = require("d3-node");
const {d3} = require("d3-node");
const fs = require('fs');

// Set up global variables which can be changed
const width = 1481;
const height = 620;
const fileName = "./psap.json";
const activeFillColor = "#ffffff";
const getRegion = feature => feature.properties.STATE; // helper func to grab the region of each feature
const getId = feature => feature.properties.GEO_ID; // helper func to grab the unique feature ID of each feature

const convertSvgFiles = async () => {
   // Entry point into main convert GeoJSON to PNG function
    const converter = createConverter();

    try {
        // Load the GeoJSON file which can be located locally (or via a link)
        const f = path.join(__dirname, fileName);
        const json = require(f);

        // Find all the unique regions in our data set, while keeping the features attached to the nested data
        const regions = d3.nest()
            .key(d => getRegion(d))
            .entries(json.features);
console.log("regionsss", regions[0].values.length);
        // Go through each region and create a generic FeatureCollection for the polygons within that region
        for (const region of regions) {
        
            // Using the FeatureCollection, center the region with the selected geographic projection
            const projection = d3.geoMercator()
                .fitSize([width, height], {
                    "type": "FeatureCollection",
                    "name": "UK_2",
                    "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
                    "features": region.values
                });
            const p = d3.geoPath(projection);
            
            // Go through each feature, or constituency, within the region, 
            // and render it as SVG with the feature highlighted
            const features = region.values;
            for (let feature of features) {
                console.log("featureee",feature);
                const renderedSVG = await renderSVG(features, feature, p);
                console.log("rendered Svg",renderedSVG);
                try {
                    // Using the `sharp` library, take the rendered SVG string and generate a PNG
                    await sharp(Buffer.from(renderedSVG.svgString))
                        .extract({
                            left: 0, 
                            top: renderedSVG.y1, 
                            width: width, 
                            height: renderedSVG.y2 - renderedSVG.y1
                        })
                        .png()
                        .toFile(`./PNGS/${getId(feature)}.png`);
                } catch (err) {
                    console.error(err);
                }
            }
        }
    } finally {
        await converter.destroy();
        process.exit();
    }
};

const renderSVG = async (features, feature, p) => {
    // Use D3 on the back-end to create an SVG of the FeatureCollection
    const d3N = new D3Node();
    const svg = d3N.createSVG(width, height);

    svg
        .selectAll("path")
        .data(features)
        .enter()
        .append("path")
        .style("stroke", "black")
        .style("fill", d => getId(d) === getId(feature) ? 'pink' : "white")
        .style("shape-rendering", "crispEdges")
        .style("stroke-width", "1px")
        .attr("d", p);

    // Use the bounds of the feature to make sure our images don't have any extra white space around them
    let y1, y2;
    features.forEach(feature => {
        const bound = p.bounds(feature);
        if (!y1 || bound[0][1] < y1) y1 = bound[0][1];
        if (!y2 || bound[1][1] > y2) y2 = bound[1][1];
    });

    const svgString = d3N.svgString();

    return {
             svgString, 
             y1: Math.floor(Math.max(y1, 0)), 
             y2: Math.floor(y2)
           };
};

// const renderSVG = async (features, feature, p) => {
//     // Use D3 on the back-end to create an SVG of the FeatureCollection
//     const d3N = new D3Node();
//     const svg = d3N.createSVG(width, height);
//     svg
//         .selectAll("path")
//         .data(features)
//         .enter()
//         .append("path")
//         .style("stroke", "transparent")
//         .style("fill", d => "transparent")
//         .text(function (d) { return d.properties.state_name; })
//         .style("shape-rendering", "crispEdges")
//         .style("stroke-width", "1px")
//         .attr("d", p);

//         svg.selectAll("text")
//     .data(features)
//     .enter()
//     .append("text")
//     .attr("fill", "white")
//     .attr("transform", function(d) { 
//         var centroid = p.centroid(d);
//         return "translate(" + centroid[0] + "," + centroid[1] + ")"
//     })
//     .attr("text-anchor", "middle")
//     .attr("dy", ".35em")
//     .text(function(d) {
//           return d.properties.state_name;
//     });


//         // svg
//         // .selectAll("text")
//         // .data(features)
//         // .enter()
//         // .append("text")
//         // .attr("transform", d => `translate(${path.centroid(d)})`)
//         // .attr("text-anchor", "middle")
//         // .attr("font-size", 10)
//         // .attr("dx", d => {console.log("d",d); return _.get(d, "offset[0]", null)})
//         // .attr("dy", d => _.get(d, "offset[1]", null))
//         // .text(d => d.properties.state_name);
    
//     //     var texts = svg.selectAll(".place-label")
//     //     .data(features)
//     //   .enter().append("text")
//     //     .attr("class", "place-label")
//     //     .attr("transform", function(d) { console.log("d",d.geometry.coordinates[0][0][0][0]); return "translate(" + projection(d.geometry.coordinates[0][0][0][0]) + ")"; })
//     //     .attr("dy", ".35em")
//     //     .text(function(d) { console.log("d",d); return d.properties.state_name; });

//     //   var tr =  svg.selectAll(".place-label")
//     // .attr("x", function(d) {console.log("d",d); return d.geometry.coordinates[0] > -1 ? 6 : -6; })
//     // .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; });

//     // var texts = svg.selectAll(".myTexts")
//     //     .data(features)
//     //     .enter()
//     //     .append("svg:text");
    
//     // texts
//     // .style("color", d => "red")

//     // // .attr("x", function(d){ return  path.centroid(d)[0];})
//     // //     .attr("y", function(d,i){ return  path.centroid(d)[1];})
//     //     .attr("text-anchor","middle")
//     // .attr('font-size','6pt')
//     //     .text(function(d){ return d.properties.state_name});
        
//     // var thing = svg.append("g")
//     //     .attr("id", "thing")
//     //     .style("fill", "navy");
    
//     // thing.append("text")
//     //     .style("font-size", "20px")
//     //   .append("textPath")
//     //     .attr("xlink:href", "#s3")
//     //     .text(function (d) { return d.properties.state_name; })
    
//     // thing.append("use")
//     //     .attr("xlink:href", "#s3")
//     //     .style("stroke", "black")
//     //     .style("fill", "none");
//         // g.append('text')
//         // .attr('dy', '.35em')
//         // .text((d) => d.properties.state_name);

//     //     var label = svg.selectAll(null)
//     // .data(features)
//     // .enter()
//     // .append("text")
//     // .text(function (d) { return d.properties.state_name; })
//     // .style("text-anchor", "middle")
//     // .style("fill", "#555")
//     // .style("font-family", "Arial")
//     // .style("font-size", 12)
//     // .attr("d",p);
//     // svg.selectAll("text")
//     //     .data(dataset)
//     //     .enter()
//     //     // Add your code below this line
//     //     .append("text")
//     //     .attr("d",p)
//     //     .text((d)=>d.properties.state_name);
//     //     // .text(function(d) { console.log("ddddd",d);return d.properties.state_name; })
        
//     //     svg
//     //     .selectAll("text")
//     //     .data(features)
//     //     .enter()
//     //     .append("svg:text")
//     // .text(function(d){
//     //     return d.properties.state_name;
//     // })
//     // .attr("x", function(d){
//     //     return path.centroid(d)[0];
//     // })
//     // .attr("y", function(d){
//     //     return  path.centroid(d)[1];
//     // })
//     // .attr("text-anchor","middle")
//     // .attr('font-size','6pt');

    

//     // Use the bounds of the feature to make sure our images don't have any extra white space around them
//     let y1, y2;
//     features.forEach(feature => {
//         const bound = p.bounds(feature);
//         if (!y1 || bound[0][1] < y1) y1 = bound[0][1];
//         if (!y2 || bound[1][1] > y2) y2 = bound[1][1];
//     });

//     const svgString = d3N.svgString();
//     fs.writeFile(`./test`,svgString);
//     console.log("done",new Date());



//     return {
//              svgString, 
//              y1: Math.floor(Math.max(y1, 0)), 
//              y2: Math.floor(y2)
//            };
// };

// Run the application to convert the SVG files
convertSvgFiles()
  .then();