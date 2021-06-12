// Write a function that will build the metadata for a single sample. It should do the following:
function buildMetadata(sample) {
// - loop over the samples.json file with d3.json().then()
    d3.json("samples.json").then((data) => {
        console.log(data)
// - extract the metadata from the json
        var metadata = data.metadata;
// - filter the metadata for the sample id
        var metaSampleId = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = metaSampleId[0];
        // console.log(sampleId)
// - update the metadata html elements
        var sampleMetadata = d3.select("#sample-metadata");
// - clear any existing metadata in the metadata html elements
        sampleMetadata.html(""); 
// - append hew header tags for each key-value pair in the filtered metadata
        Object.entries(result).forEach(([key, value]) => {
                sampleMetadata.append("h6").text(`${key.toUpperCase()}: ${value}`);
                });
         });
};


// Write a function that will build the charts for a single sample. It should do the following:
function buildCharts(sample) {
// - loop over the samples.json file with d3.json().then()
        d3.json("samples.json").then((data) => {
// - extract the samples from the json
                var samples = data.samples;
// - filter the samples for the sample id
                var sampleId = samples.filter(sampleObj => sampleObj.id == sample);
                var result = sampleId[0]
// - extract the ids, labels, and values from the filtered result
                var otuIds = result.otu_ids;
                var otuLabels = result.otu_labels;
                var sampleValues = result.sample_values;
// - build a bubble chart and plot with Plotly.newPlot()
                var bLayout = {
                        title: "Bacteria Per Sample",
                        margin: { t: 0 },
                        hovermode: "closest",
                        xaxis: { title: "OTU ID" },
                        margin: { t: 30}
                };
                var bData = [{
                        x: otuIds,
                        y: sampleValues,
                        text: otuLabels,
                        mode: 'markers',
                        marker: {
                                size: sampleValues,
                                color: otuIds,
                                colorscale: "Geyser"
                        }
                }];
                Plotly.newPlot('bubble', bData, bLayout)
// - build a bar chart and plot with Plotly.newPlot()
                var yticks = otuIds.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
                var barData = [{
                        y: yticks,
                        x: sampleValues.slice(0, 10).reverse(),
                        text: otuLabels.slice(0, 10).reverse(),
                        type: "bar",
                        orientation: "h",
                }];

                var barLayout = {
                title: "Top 10 Bacteria Found",
                margin: { t: 30, l: 150 }
                };

                Plotly.newPlot("bar", barData, barLayout);
        });
};

// Write a function called init() that will populate the charts/metadata and elements on the page. It should do the following:
function init() {
// - select the dropdown element in the page
        var dropdown = d3.select("#selDataset");
        console.log(dropdown)
// - loop over the samples.json data to append the .name attribute into the value of an option HTML tag (lookup HTML documentation on dropdown menus)
        d3.json("samples.json").then((data) => {
                var names = data.names;
// - extract the first sample from the data
                names.forEach((sample) => {
                        // console.log(sample)
                        dropdown.append('option')
                                .text(sample)
                                .property('value', sample);

                });
// - call your two functions to build the metadata and build the charts on the first sample, so that new visitors see some data/charts before they select something from the dropdown
                var firstSample = names[0]
                buildCharts(firstSample);
                buildMetadata(firstSample);
        });
}


// Write a function called optionChanged() that takes a new sample as an argument. It should do the following:
function optionChanged(newSample) {
// - call your two functions to build the metadata and build the charts on the new sample
        buildCharts(newSample);
        buildMetadata(newSample);
}
// Look at line 30 of index.html: that is the event listener that will call this function when someone selects something on the dropdown



// Initialize the dashboard by calling your init() function
init();

