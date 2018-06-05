const getDefaultOptions = (totalInteractions, tagImpressions) => {
    return {
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
                {y: totalInteractions, label: "Total Interactions"},
                {y: tagImpressions, label: "Tag Impressions"}
            ]
        }]
    }
};


const countHits = function () {

    const renderChart = () => {
        console.log("Import Complete");
        const esData = this.response.aggregations.funnel.buckets;

        $("#chartContainer").CanvasJSChart(calculatePercentage(esData));

        function calculatePercentage(esData) {
            const totalInteractions = esData[0].doc_count;
            const tagImpressions = esData[1].doc_count;
            const options = getDefaultOptions(totalInteractions, tagImpressions);
            const dataPoint = options.data[0].dataPoints;
            const total = dataPoint[0].y;
            options.data[0].dataPoints[0].percentage = 100;
            for (let i = 1; i < dataPoint.length; i++) {
                options.data[0].dataPoints[i].percentage = ((dataPoint[i].y / total) * 100).toFixed(2);
            }
            return options;
        }

    };


    $.getScript("https://canvasjs.com/assets/script/jquery.canvasjs.min.js", renderChart);

};

({
    count_hits: countHits,
    debug: function () {
        return JSON.stringify(this, null, ' ');
    }
})