function showGraph(event, graphContent) {
  let graphs = document.getElementsByClassName('graph');
  for (let i = 0; i < graphs.length; i++) {
    graphs[i].style.display = "none"
  };

  let tabLabels = document.getElementsByClassName('tab-label');
  for (let i = 0; i < tabLabels.length; i ++) {
    tabLabels[i].className = tabLabels[i].className.replace('active', '')
  };
  document.getElementById(graphContent).style.display = 'block';

  event.currentTarget.className += ' active';
}

document.getElementById('covid-tab').click();

const margin = {
  top: 40, right: 20, bottom: 30, left: 50
};
const width = 600;
const height = 400;
const barColor = "rgba(111, 111, 111, .5)";
const borderColor = "rgba(111, 111, 111)";
const backgroundColor = "#E5E5E5";
const dotColor = "rgb(162, 45, 63)";
// const axisLabelColor =  "rgb(111, 111, 111)";
const axisLabelColor = "rgb(52, 118, 148)"
const axisLineColor = "black"

let benfordData = [
    {digit: 1, count: 301}, {digit: 2, count: 176}, {digit: 3, count: 125}, {digit: 4, count: 97}, {digit: 5, count: 79}, {digit: 6, count: 67}, {digit: 7, count: 58}, {digit: 8, count: 51}, {digit: 9, count: 46}
  ]

d3.json('./data/USDaily.json').then((data, error) => {
  // data from covidtracking.com
  if (error) throw error;
  let firstDigitCount = [
    {deathIncrease: [{digit: 1, count: 0}, {digit: 2, count: 0}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]},
    {hospitalizedIncrease: [{digit: 1, count: 0}, {digit: 2, count: 0}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]},
    {negativeIncrease: [{digit: 1, count: 0}, {digit: 2, count: 0}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]},
    {positiveIncrease: [{digit: 1, count: 0}, {digit: 2, count: 0}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]},
    {totalTestResultsIncrease: [{digit: 1, count: 0}, {digit: 2, count: 0}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]},
    {testdata: [{digit: 1, count: 12}, {digit: 2, count: 8}, {digit: 3, count: 6}, {digit: 4, count: 4}, {digit: 5, count: 3}, {digit: 6, count: 3}, {digit: 7, count: 2}, {digit: 8, count: 2}, {digit: 9, count: 1}]}
  ];
  const categories = ['deathIncrease', 'hospitalizedIncrease', 'negativeIncrease', 'positiveIncrease', "totalTestResultsIncrease"]
  data.forEach(d => {
    categories.forEach((currCat, i) => {
      let firstDigit = Math.abs(d[currCat]).toString().slice(0,1);
      if (firstDigit != 0) {
        firstDigitCount[i][currCat][firstDigit - 1].count++;
      };
    })
  });

  const svgCovid = d3.select('.covid-graph-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('border', `3px solid ${borderColor}`)

  let newData = Object.values(Object.values(firstDigitCount).filter(d => Object.keys(d)[0] === 'testdata')[0])[0];
  function changeData(type) {
    newData = Object.values(Object.values(firstDigitCount).filter(d => Object.keys(d)[0] === type)[0])[0];
  }

  redraw(newData);

  d3.selectAll('input')
    .on('change', () => {
      changeData(d3.select('input:checked').property('value'))
      d3.selectAll('.covid-graph-group').remove();
      redraw(newData);
    });

  function redraw(drawData) {
    let graphTitle = "Daily Change"
    svgCovid.append('rect')
      .attr('class', 'main-div')
      .style('fill', backgroundColor)
      .attr('width', width)
      .attr('height', height);
    
    const g = svgCovid.append('g')
      .attr('class', 'covid-graph-group');

    drawGraph(drawData, g, graphTitle);
  }
})

d3.csv('./data/2019_USPOPEST.csv').then((data, error) => {
  // data from census.gov
  if (error) throw error;
  let graphTitle = "U.S. Population by State"
  let drawData = [
    {digit: 1, count: 0}, {digit: 2, count: 0}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}
  ];

  data.forEach(d => {
    let firstDigit = Math.abs(d.POPESTIMATE2019).toString().slice(0,1);
    if (firstDigit != 0) {
      drawData[firstDigit - 1].count++;
    }
  })

  const svgUSPop = d3.select('.us-pop-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('border', `3px solid ${borderColor}`)

  svgUSPop.append('rect')
    .attr('class', 'main-div')
    .style('fill', backgroundColor)
    .attr('width', width)
    .attr('height', height);

  const g = svgUSPop.append('g')
    .attr('class', 'us-pop-graph-group')

  drawGraph(drawData, g, graphTitle)
})

d3.json('./data/WorldPop.json').then((data, error) => {
  // data from worldpopulationreview.com
  if (error) throw error;
  let graphTitle = "World Population by Country"
  let drawData = [{digit: 1, count: 0}, {digit: 2, count: 0}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]
  data.forEach(data => {
    // there is an anomoly in the data; pop2020 for Djibouti is an INT instead of STRING
    let popFirstDigit = data.pop2020.toString().slice(0,1);
    if (popFirstDigit != 0) drawData[popFirstDigit - 1].count++;
  })

  const svgWorldPop = d3.select('#world-pop-graph')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('border', `3px solid ${borderColor}`)

  svgWorldPop.append('rect')
    .attr('class', 'main-div')
    .style('fill', backgroundColor)
    .attr('width', width)
    .attr('height', height);

  const g = svgWorldPop.append('g')
    .attr('class', 'world-pop-graph-group')
  drawGraph(drawData, g, graphTitle)
})

d3.json('./data/WorldPop.json').then((data, error) => {
  // data from worldpopulationreview.com
  if (error) throw error;
  let graphTitle = "Area (km²) of Countries"
  let drawData = [{digit: 1, count: 0}, {digit: 2, count: 0}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]
  data.forEach(data => {
    let areaFirstDigit = data.area.toString().slice(0,1);
    if (areaFirstDigit != 0) drawData[areaFirstDigit - 1].count++;
  })

  const svgWorldArea = d3.select('#world-area-graph')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('border', `3px solid ${borderColor}`)

  svgWorldArea.append('rect')
    .attr('class', 'main-div')
    .style('fill', backgroundColor)
    .attr('width', width)
    .attr('height', height);

  const g = svgWorldArea.append('g')
    .attr('class', 'world-pop-graph-group')
  drawGraph(drawData, g, graphTitle)
})

fibsData();

function fibsData() {
  let graphTitle = "Fibonacci Sequence"
  let drawData = [{digit: 1, count: 1}, {digit: 2, count: 1}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]
  let prevNum = 1;
  let currNum = 1;
  for (let i = 0; i < 1000; i++){
    if (i <= 2) {
      drawData[0].count++
    } else {
      let sum = prevNum + currNum;
      prevNum = currNum;
      currNum = sum;
      let firstDigit = sum.toString().slice(0,1);
      drawData[firstDigit - 1].count++;
    }
  }

  const svgFibSeq = d3.select('#fib-seq-graph')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('border', `3px solid ${borderColor}`)

  svgFibSeq.append('rect')
    .attr('class', 'main-div')
    .style('fill', backgroundColor)
    .attr('width', width)
    .attr('height', height);

  const g = svgFibSeq.append('g')
    .attr('class', 'fib-seq-group')

  drawGraph(drawData, g, graphTitle)
}

d3.csv('./data/periodictable.csv').then((data, error) => {
  // data from https://gist.github.com/GoodmanSciences
  if (error) throw error;
  let graphTitle = "Atomic Mass of Elements"
  let drawData = [{digit: 1, count: 1}, {digit: 2, count: 1}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]
  data.forEach(d => {
    let firstDigit = d.AtomicMass.toString().slice(0,1);
    if (firstDigit != 0) drawData[firstDigit - 1].count++;
  })

  const svgPerTable = d3.select('#elements-graph')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('border', `3px solid ${borderColor}`)

    svgPerTable.append('rect')
    .attr('class', 'main-div')
    .style('fill', backgroundColor)
    .attr('width', width)
    .attr('height', height);

  const g = svgPerTable.append('g')
    .attr('class', 'elements-group')

  drawGraph(drawData, g, graphTitle)
})

d3.csv('./data/fortune2000_2020.csv').then((data, error) => {
  if (error) throw error;
  let graphTitle = "Market Value of Fortune 2000 Companies"
  let drawData = [{digit: 1, count: 1}, {digit: 2, count: 1}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]
  data.forEach(d => {
    let firstDigit = d["Market Value"].toString().slice(0,1);
    if (firstDigit != 0) drawData[firstDigit - 1].count++;
  })

  const svgFortunesTable = d3.select('#fortunes-graph')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('border', `3px solid ${borderColor}`)

  svgFortunesTable.append('rect')
    .attr('class', 'main-div')
    .style('fill', backgroundColor)
    .attr('width', width)
    .attr('height', height);

  const g = svgFortunesTable.append('g')
    .attr('class', 'fortunes-group')

  drawGraph(drawData, g, graphTitle)
})

d3.csv('./data/reddit.csv').then((data, error) => {
  // data from frontpagemetrics.com 2020/09/29
  if (error) throw error;
  let graphTitle = "Reddit Subscribers by SubReddit"
  let drawData = [{digit: 1, count: 1}, {digit: 2, count: 1}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]
  data.forEach(d => {
    let firstDigit = d.Subscribers.toString().slice(0,1);
    if (firstDigit != 0) drawData[firstDigit - 1].count++;
  })

  const svgReddit = d3.select('#reddit-graph')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('border', `3px solid ${borderColor}`)

  svgReddit.append('rect')
    .attr('class', 'main-div')
    .style('fill', backgroundColor)
    .attr('width', width)
    .attr('height', height);

  const g = svgReddit.append('g')
    .attr('class', 'reddit-group')

  drawGraph(drawData, g, graphTitle)
})

d3.csv('./data/movies2019.csv').then((data, error) => {
  // data from boxofficemojo.com
  if (error) throw error;
  let graphTitle = "2019 Movie Gross Revenues"
  let drawData = [{digit: 1, count: 1}, {digit: 2, count: 1}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]
  data.forEach(d => {
    let firstDigit = d.Gross.toString().slice(0,1);
    if (firstDigit != 0) drawData[firstDigit - 1].count++;
  })

  const svgMovies = d3.select('#movies-graph')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('border', `3px solid ${borderColor}`)

  svgMovies.append('rect')
    .attr('class', 'main-div')
    .style('fill', backgroundColor)
    .attr('width', width)
    .attr('height', height);

  const g = svgMovies.append('g')
    .attr('class', 'movies-group')

  drawGraph(drawData, g, graphTitle)
}) 

d3.csv('./data/fortune500_2020.csv').then((data, error) => {

  if (error) throw error;
  let graphTitle = "Market Value of Fortune 500 Companies"
  let drawData = [{digit: 1, count: 1}, {digit: 2, count: 1}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]
  data.forEach(d => {
    let firstDigit = d['MarketValue '].toString().slice(0,1);
    if (firstDigit != 0 && !isNaN(firstDigit)) drawData[firstDigit - 1].count++;
  })

  const svgUS500 = d3.select('#us500-graph')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('border', `3px solid ${borderColor}`)

  svgUS500.append('rect')
    .attr('class', 'main-div')
    .style('fill', backgroundColor)
    .attr('width', width)
    .attr('height', height);

  const g = svgUS500.append('g')
    .attr('class', 'us500-group')

  drawGraph(drawData, g, graphTitle)
}) 


function drawGraph(drawData, selection, graphTitle) {

  let countTotal = drawData.reduce(((acc, curr) => curr.count + acc), 0);

  const xScale = d3.scaleBand()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
    .range([margin.left, width - margin.right])
    .padding(.3);

  const drawDataYMax = d3.max(Object.values(drawData).map(d => d.count / countTotal * 100));
  const benfordDataYMax = d3.max(Object.values(benfordData).map(d => d.count / 10));
  const yDomainMax = drawDataYMax > benfordDataYMax ? drawDataYMax : benfordDataYMax;

  const yScale = d3.scaleLinear()
    .domain([0, yDomainMax + 5])
    .range([height - margin.top, margin.bottom]);

  const xAxis = d3.axisBottom()
    .scale(xScale);

  const yAxis = d3.axisLeft()
    .scale(yScale);

  selection.selectAll('rect')
    .data(drawData)
    .join('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.digit))
    .attr('y', d => yScale((d.count/countTotal) * 100))
    .attr('width', d => xScale.bandwidth())
    .attr('height', d => yScale(0) - yScale((d.count/countTotal) * 100))
    .attr('fill', barColor);

  selection.selectAll('circle')
    .data(benfordData)
    .join('circle')
    .attr('class', 'benford-dot')
    .attr('cx', d => xScale(d.digit) + 20)
    .attr('cy', d => yScale(d.count / 10))
    .attr('r', 5)
    .attr('fill', dotColor)
    
  const axisBottom = selection.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height - margin.top})`)
    .style('color', axisLineColor)
    .call(xAxis);

  const axisLeft = selection.append('g')
    .attr('class', 'y-axis')
    .attr('transform',`translate(${margin.left}, 0)`)
    .style('color', axisLineColor)
    .call(yAxis)
  
  selection.append('text')
    .attr('x', width / 2)
    .attr('y', height - 8)
    .attr('text-anchor', 'middle')
    .style('fill', axisLabelColor)
    .style('font-weight', 'bold')
    .text('First Digit')

  selection.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', `translate(${margin.left - 30}, ${height / 2}) rotate(270)`)
    .style('fill', axisLabelColor)
    .style('font-weight', 'bold')
    .text('Occurance %')

  selection.append('text')
    .attr('class', 'graph-title')
    .attr('x', width / 2)
    .attr('y', 50)
    .attr('text-anchor', 'middle')
    .text(graphTitle)
}