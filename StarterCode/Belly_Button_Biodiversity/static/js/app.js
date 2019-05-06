function buildMetadata(sample) {

  // Build the metadata panel
  // Fetch the metadata for a sample
    var url = `/metadata/${sample}`;
    d3.json(url).then(function(sample){
    
      // Use d3 to select the panel with id of `#sample-metadata`
      var sample_metadata = d3.select("#sample-metadata");
      // Clear any existing metadata
      sample_metadata.html("");

      // Add each key and value pair to the panel
      Object.entries(sample).forEach(function ([key, value]) {
        var row = sample_metadata.append("p");
        row.text(`${key}: ${value}`);
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}
  )};

function buildCharts(sample) {

  // Fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {

    // Build a Bubble Chart using the sample data
    var x_values = data.otu_ids;
    var y_values = data.sample_values;
    var m_size = data.sample_values;
    var m_colors = data.otu_ids; 
    var t_values = data.otu_labels;

    var trace1 = {
      x: x_values,
      y: y_values,
      text: t_values,
      mode: 'markers',
      marker: {
        color: m_colors,
        size: m_size
      } 
    };
  
    var data = [trace1];

    var layout = {
      xaxis: { title: "OTU ID"},
    };

    Plotly.newPlot('bubble', data, layout);
    // Build a Pie Chart
    d3.json(url).then(function(data) {  
      var pie_values = data.sample_values.slice(0,10);
      var pie_labels = data.otu_ids.slice(0,10);
      var pie_hover = data.otu_labels.slice(0,10);
  
      var data = [{
          values: pie_values,
          labels: pie_labels,
          hovertext: pie_hover,
          type: 'pie'
                  }];
  
        Plotly.newPlot('pie', data);
  
      });
    });   
  }
    


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Populate the select options with list of sample names
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
