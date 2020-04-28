var realDW = $( document ).width(), // @int --> real document width
    alertStatisticChartClass, // @object -----> alert Statistic Chart data
    indexCsiChartPersentClass, // @object -----> alert Statistic Chart data
    position; // @string ---------------------> side of legend position in charts

$(document).ready(function () {
        // add charts
        setSize();
        generateCharts();
        $( window ).on( 'resize', function () {
            // console.log( 'i' );
            setTimeout( function () {
                checkMedia( $( document ).width() , getmediaPeriod( realDW ) );
            }, 80 );
        } )
});
/**
 *   function create chart
 */
function generateCharts() {
    // draw text in doughnut center*/
    Chart.pluginService.register({
        beforeDraw: function(chart) {
            if(chart.config.options.elements.center) {
                var rad = $(chart.canvas).width() / 3.5 - 15;
                var width = chart.chart.width,
                    height = chart.chart.height,
                    ctx = chart.chart.ctx;


                var arrData = chart.config.data.datasets[0].data;
                var srrmaxData =  Math.max.apply(null, arrData);


                var collsrFillRound = '#ffffff';
                var collsrFontRound = '#ffffff';

                if(arrData[1]>arrData[0]) {
                    collsrFontRound = '#e8594a';
                }
                else {
                    collsrFontRound = '#30cc7c';
                }
                ctx.restore();
                var fontSize = rad / 1.2;
                ctx.font = fontSize + "px sans-serif";
                ctx.textBaseline = "middle";

                var text = chart.config.options.elements.center.text,
                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                    textY = height / 2;

                ctx.beginPath();

                if( chart.config.data.round ){

                    var as = ctx.measureText(text).width / 2;
                    ctx.arc(textX + as,textY,rad,0,2*Math.PI);
                    ctx.fillStyle = collsrFillRound;
                    ctx.fill();

                    ctx.arc(textX + as,textY,rad,0,2*Math.PI);
                    ctx.strokeStyle = "#ffffff";
                    ctx.stroke();
                    var fontColor = collsrFontRound;
                }
                else {
                    var fontColor = chart.config.options.elements.center.color;
                    textX-= 2;
                    ctx.font = 32 + "px sans-serif";
                }

                ctx.fillStyle = fontColor;
                ctx.fillText(text, textX, textY);
                ctx.save();
            }
        }
    });

    // doughnut chart
    var indexCsiChartElementPersenage = document.getElementById('index-csi-chart-persent-canvas');
    try {
        if (indexCsiChartData && centerDonutTxt) {
            var indexCsiChartPersent = new Chart(indexCsiChartElementPersenage, {
                type: 'doughnut',
                data: indexCsiChartData,
                options: {
                    tooltips: {
                        titleFontSize:11,
                        bodyFontSize: 11,
                        defaultFontSize: 11,
                    },
                    responsive: true,
                    maintainAspectRatio : false,
                    legend: {
                        display: false,
                        position: 'bottom',
                        fullWidth:true,
                        labels: {
                            fontColor: 'rgb(0, 0, 0)',
                            fontSize: 9,
                            padding: 20,
                            boxWidth: 15
                        }
                    },
                    legendCallback: function(chart) {
                        var text = [];
                        text.push('<ul class="' + chart.id + '-legend" style="list-style: none; padding: 0;">');
                        for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
                            text.push('<li style="font-size: 11px;"><span style="font-size: 8px; width: 10px; height: 10px; display: inline-block; margin-right: 10px; background-color:' + chart.data.datasets[0].backgroundColor[i] + '">');
                            text.push('</span>');
                            if (chart.data.labels[i]) {
                                text.push(chart.data.labels[i]);
                            }
                            text.push('</span></li>');
                        }
                        text.push('</ul>');
                        return text.join("");
                    },
                    pieceLabel: {
                        render: 'РІlabel',
                        fontColor: '#fff',
                        fontSize: 15,
                        precision: 0
                        //position: 'outside'
                    },
                    elements: {
                        center: {
                            bull: false,
                            text: centerDonutTxt,
                            color: '#c1db06', //Default black
                            fontStyle: 'sans-serif', //Default Arial
                            sidePadding: 15 //Default 20 (as a percentage)
                        }
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10
                        }
                    },
                }
            });
            indexCsiChartPersentClass = indexCsiChartPersent;
        }
        document.getElementById('legend1').innerHTML = indexCsiChartPersentClass.generateLegend();
    }
    catch(err) {
        console.warn(err);
    }
    //alert chart 
    try {
        var alertStatisticChartCanvas = document.getElementById("alert-statistic-chart-canvas").getContext('2d');
        var alertStatisticChart = new Chart(alertStatisticChartCanvas, {
            type: 'horizontalBar',
            data: alertStatisticChartData,
            options: {
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMax: 120,
                            max: 120,
                            beginAtZero:true,
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            suggestedMin: 0,
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
        alertStatisticChartClass = alertStatisticChart;
        alertStatisticChart.legend = false;
    }
    catch(err) {
        console.warn(err);
    }
} // add charts


/**
 *   function generate new charts
 */
function setNewPosition() {

    // kill old charts
    alertStatisticChartClass.destroy();
    indexCsiChartPersentClass.destroy();

    var chartArr = [
        $('#index-csi-chart-canvas'),
        $('#alert-statistic-chart-canvas')
    ];

    chartArr.forEach( function (item) {
        var id =  $( item ).attr( 'id' );
        var parent = $( item ).parent();
        $( item ).remove();
        $( parent ).append( '<canvas id="' + id + '"><canvas>' );
    } );

    // set width and height
    setSize();

    // generate chart
    generateCharts();


    alertStatisticChartClass.update();
    indexCsiChartPersentClass.update();


} // set new width and height for charts
function getmediaPeriod( w ) {
    var mediaperiodsArr = [  // media array
        [1700, 2900],
        [1600, 1700],
        [1500, 1600],
        [1400, 1500],
        [1350, 1400],
        [1300, 1350],
        [1200, 1300],
        [1000, 1200],
        [767, 1000],
        [600, 767],
        [0, 600]
    ];

    for ( var i = 0; i < mediaperiodsArr.length; i++ ){
        if ( w > mediaperiodsArr[i][0] ) {
            return mediaperiodsArr[i];
            break;
        }
    } // return Media Period

}

/**
 *   function check id media period was chenget
 *   if period was changed set new width
 *   @param{Integer} width
 *   @param{Array} period
 */
function checkMedia( w, period ) {

    if ( w < period[0] || w > period[1] ){
        setNewPosition();
        realDW = w;
    }

} // check is media period changed
/**
 *   function set new width for canvas
 */
function setSize() {
    $('#index-csi-chart-persent-canvas').attr('width', 150);
    $('#index-csi-chart-persent-canvas').attr('height', 200);
    if( $( document ).width() > 1700){
        //line chart
        position = 'right';
        $('#alert-statistic-chart-canvas').attr('width', 1200 );
        $('#alert-statistic-chart-canvas').attr('height', 350 );
    }
    else if( $( document ).width() > 1600){
        position = 'right';
        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 305 );
    }
    else if( $( document ).width() > 1500){
        position = 'right';
        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 280 );
    }
    else if( $( document ).width() > 1400) {
        position = 'right';
        $('#alert-statistic-chart-canvas').attr('width', 800);
        $('#alert-statistic-chart-canvas').attr('height', 280)
    }
    else if( $( document ).width() > 1350){
        position = 'right';
        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 270 );

    }
    else if( $( document ).width() > 1300){
        position = 'bottom';
        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 290 );
    }
    else if( $( document ).width() > 1200 ){
        position = 'bottom';
        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 350 );
    }
    else if( $( document ).width() > 1000 ){
        position = 'bottom';
        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 290 );
    }
    else if( $( document ).width() > 767 ){
        position = 'bottom';
        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 340 );
    }
    else if( $( document ).width() > 600 ){
        position = 'bottom';
        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 340 );
    }
    else if( $( document ).width() < 600 ){
        position = 'bottom';
        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 440 );
    }
    else {
        position = 'bottom';
        $('#alert-statistic-chart-canvas').attr('width', 800 );
        $('#alert-statistic-chart-canvas').attr('height', 280 );
    }

} // add media sizes
