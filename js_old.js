({

    // before_render: function () {
    //     $.getScript("https://canvasjs.com/assets/script/jquery.canvasjs.min.js", function (data, textStatus, jqxhr) {
    //         console.log("Import Complete");
    //     });
    // },
    count_hits: function () {

        var that  = this;

        $.getScript("https://canvasjs.com/assets/script/jquery.canvasjs.min.js", function (data, textStatus, jqxhr) {
            console.log("Import Complete");

            // alert(that.response);

            var esData = that.response.aggregations.funnel.buckets;
            var totalInteractions = esData[0].doc_count;
            var tagImpressions = esData[1].doc_count;

            //= esData.Shopped.doc_count;

            var options = {
                animationEnabled: true,
                theme: "light1", //"light1", "light2", "dark1", "dark2"
                title: {
                    text: "Conversion Funnel",
                    horizontalAlign: "left",
//         fontSize: 50
                },
                data: [{
                    type: "pyramid",
                    reversed: true,
//         neckHeight:  "60%",
                    neckWidth: "35%",
                    valueRepresents: "area",
                    toolTipContent: "{label}: {y} ({percentage}%)",
                    indexLabel: "{label} ({percentage}%)",
                    dataPoints: [
                        { y: totalInteractions, label: "Total Interactions" },
                        { y: tagImpressions, label: "Tag Impressions" }
                    ]
                }]
            };
            calculatePercentage();
            function chartDelay() {
                // this in conjunction with setTimeout is necessary to prevent the chart from loading before library is loaded. This is only a problem for the first page load because before when you first go to the dashboards, this chart doesn't load until you refresh once.
                $("#chartContainer").CanvasJSChart(options);
            }
            // setTimeout(chartDelay, 0);
            chartDelay();
            function calculatePercentage() {
                var dataPoint = options.data[0].dataPoints;
                var total = dataPoint[0].y;
                for (var i = 0; i < dataPoint.length; i++) {
                    if (i === 0) {
                        options.data[0].dataPoints[i].percentage = 100;
                    } else {
                        options.data[0].dataPoints[i].percentage = ((dataPoint[i].y / total) * 100).toFixed(2);
                    }
                }
            }



        })




    },


    debug: function () {
        return JSON.stringify(this, null, ' ');
    }
})
