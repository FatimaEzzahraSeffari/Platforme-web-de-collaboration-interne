import React from "react";
import ReactApexChart from "react-apexcharts";
import useChartColors from "Common/useChartColors";

const GroupedStackedBars = ({ chartId }: any) => {

    const chartColors = useChartColors(chartId);
    //Grouped Stacked Bars
    const series = [
        {
            name: 'Q1 Budget',
            group: 'budget',
            data: [44000, 55000, 41000, 67000, 22000]
        },
        {
            name: 'Q1 Actual',
            group: 'actual',
            data: [48000, 50000, 40000, 65000, 25000]
        },
        {
            name: 'Q2 Budget',
            group: 'budget',
            data: [13000, 36000, 20000, 8000, 13000]
        },
        {
            name: 'Q2 Actual',
            group: 'actual',
            data: [20000, 40000, 25000, 10000, 12000]
        }
    ];
    var options : any = {
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        dataLabels: {
            formatter: (val : any) => {
                return val / 1000 + 'K';
            }
        },
        plotOptions: {
            bar: {
                horizontal: true
            }
        },
        xaxis: {
            categories: [
                'Online advertising',
                'Sales Training',
                'Print advertising',
                'Catalogs',
                'Meetings'
            ],
            labels: {
                formatter: (val : any) => {
                    return val / 1000 + 'K';
                }
            }
        },
        fill: {
            opacity: 1,
        },
        colors: chartColors,
        legend: {
            position: 'top',
            horizontalAlign: 'left'
        }
    };

    return (
        <React.Fragment>
            <ReactApexChart
                dir="ltr"
                options={options}
                series={series || []}
                data-chart-colors='["bg-custom-500", "bg-green-500", "bg-custom-300", "bg-green-300"]'
                id={chartId}
                className="apex-charts"
                type='bar'
                height={350}
            />
        </React.Fragment>
    );
};

export {
    GroupedStackedBars
};