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

document.getElementById('fib-seq-tab').click();

const margin = {
  top: 40, right: 60, bottom: 30, left: 60
};
const width = 600;
const height = 400;
// const barColor = "rgba(111, 111, 111, .5)";
const barColor = "rgba(108, 171, 201, 1)";
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

  let newData = Object.values(Object.values(firstDigitCount).filter(d => Object.keys(d)[0] === 'deathIncrease')[0])[0];
  function changeData(type) {
    newData = Object.values(Object.values(firstDigitCount).filter(d => Object.keys(d)[0] === type)[0])[0];
  }

  redraw(newData);

  d3.selectAll('input')
    .on('change', () => {
      changeData(d3.select('input:checked').property('value'))
      d3.selectAll('.covid-graph-group').remove();
      d3.selectAll('.graph-description-container').remove();
      redraw(newData);
    });

  function redraw(drawData) {
    let sourceURL = "https://covidtracking.com/"
    svgCovid.append('rect')
      .attr('class', 'main-div')
      .style('fill', backgroundColor)
      .attr('width', width)
      .attr('height', height);
    
    const g = svgCovid.append('g')
      .attr('class', 'covid-graph-group');

    drawGraph(drawData, g, sourceURL);

    d3.select('#covid-graph')
      .append('div')
      .attr('class', 'graph-description-container')
      .html('<h3 class="graph-title">Daily Change in Number of Cases by Category</h3><p class="description-text">Using latest data from covidtracking.com</p>')
  }
})

d3.csv('./data/2019_USPOPEST.csv').then((data, error) => {
  // data from census.gov; 2019 estimates
  if (error) throw error;
  let sourceURL = "https://www.census.gov/"
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

  drawGraph(drawData, g, sourceURL)

  d3.select('#us-pop-graph')
  .append('div')
  .attr('class', 'graph-description-container')
  .html('<h3 class="graph-title">State Populations of the U.S.</h3><p class="description-text">Using 2019 estimated population. Includes 50states + D.C. and Puerto Rico</p>')
})

d3.json('./data/WorldPop.json').then((data, error) => {
  // data from worldpopulationreview.com; 2020 estimates
  if (error) throw error;
  let sourceURL = "https://worldpopulationreview.com/"
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
  drawGraph(drawData, g, sourceURL)

  d3.select('#world-pop-graph')
  .append('div')
  .attr('class', 'graph-description-container')
  .html('<h3 class="graph-title">Population of Countries of the World</h3><p class="description-text">Using 2020 estimate from worldpopulationreview.com</p>')
})

d3.json('./data/WorldPop.json').then((data, error) => {
  // data from worldpopulationreview.com
  if (error) throw error;
  let sourceURL = "https://worldpopulationreview.com/"
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
  drawGraph(drawData, g, sourceURL)

  d3.select('#world-area-graph')
  .append('div')
  .attr('class', 'graph-description-container')
  .html('<h3 class="graph-title">Area of Countries Around the World</h3><p class="description-text">Using km² as unit provided by worldpopulation.com</p>')
})

fibsData();

function fibsData() {
  let sourceURL = null;
  let drawData = [{digit: 1, count: 1}, {digit: 2, count: 1}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]
  let prevNum = 1;
  let currNum = 1;
  for (let i = 0; i < 998; i++){
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

  drawGraph(drawData, g, sourceURL)

  d3.select('#fib-seq-graph')
  .append('div')
  .attr('class', 'graph-description-container')
  .html('<h3 class="graph-title">Fibonacci Numbers</h3><p class="description-text">to the 1000th Fibonacci number</p>')
}

d3.csv('./data/periodictable.csv').then((data, error) => {
  // data from https://gist.github.com/GoodmanSciences
  if (error) throw error;
  let sourceURL = "https://gist.github.com/GoodmanSciences"
  let drawData = [{digit: 1, count: 0}, {digit: 2, count: 0}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]
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

  drawGraph(drawData, g, sourceURL)
  d3.select('#elements-graph')
  .append('div')
  .attr('class', 'graph-description-container')
  .html('<h3 class="graph-title">Atomic Mass of Elements</h3><p class="description-text">atomic mass of elements provided by GoodmanSciences</p>')
})

d3.csv('./data/fortune2000_2020.csv').then((data, error) => {
  if (error) throw error;
  let sourceURL = "https://www.forbes.com/global2000"
  let drawData = [{digit: 1, count: 0}, {digit: 2, count: 0}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]
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

  drawGraph(drawData, g, sourceURL)
  d3.select('#fortunes-graph')
  .append('div')
  .attr('class', 'graph-description-container')
  .html('<h3 class="graph-title">Market Value of Fortune 2000 Companies</h3><p class="description-text">Fortune 2000 - 2020 list</p>')
})

d3.csv('./data/reddit.csv').then((data, error) => {
  // data from frontpagemetrics.com 2020/09/29
  if (error) throw error;
  let sourceURL = "https://frontpagemetrics.com/"
  let drawData = [{digit: 1, count: 0}, {digit: 2, count: 0}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]
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

  drawGraph(drawData, g, sourceURL)

  d3.select('#reddit-graph')
  .append('div')
  .attr('class', 'graph-description-container')
  .html('<h3 class="graph-title">Reddit Subscribers by SubReddit</h3><p class="description-text">top 10,000 subreddits; data fetched 2020/09/29 from frontpagemetrics.com</p>')
})

d3.csv('./data/movies2019.csv').then((data, error) => {
  // data from boxofficemojo.com
  if (error) throw error;
  let sourceURL = "https://www.boxofficemojo.com/"
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

  drawGraph(drawData, g, sourceURL)
  d3.select('#movies-graph')
  .append('div')
  .attr('class', 'graph-description-container')
  .html('<h3 class="graph-title">Box Office Revenues by Movie</h3><p class="description-text">2019 gross revenues</p>')
}) 

d3.csv('./data/fortune500_2020.csv').then((data, error) => {

  if (error) throw error;
  let sourceURL = "https://fortune.com/fortune500/"
  let drawData = [{digit: 1, count: 0}, {digit: 2, count: 0}, {digit: 3, count: 0}, {digit: 4, count: 0}, {digit:5, count: 0}, {digit: 6, count: 0}, {digit: 7, count: 0}, {digit: 8, count: 0}, {digit: 9, count: 0}]
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

  drawGraph(drawData, g, sourceURL)

  d3.select('#us500-graph')
  .append('div')
  .attr('class', 'graph-description-container')
  .html('<h3 class="graph-title">Market Value of Fortune 500 US Companies</h3><p class="description-text">Fortune 500 - 2020 list; market value for 28 companies are not given</p>')
}) 


function drawGraph(drawData, selection, sourceURL) {

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
    .attr('fill', barColor)
    .on('mouseover', onMouseOver)
    .on('mouseout', onMouseOut);

  selection.selectAll('circle')
    .data(benfordData)
    .join('circle')
    .attr('class', 'benford-dot')
    .attr('cx', d => xScale(d.digit) + 18)
    .attr('cy', d => yScale(d.count / 10))
    .attr('r', 4)
    .attr('fill', dotColor)

  selection.append('line')
    .attr('x1', margin.left)
    .attr('y1', yScale(11.1))
    .attr('x2', width - margin.right)
    .attr('y2', yScale(11.1))
    .style('stroke', 'rgb(93, 128, 145)')
    .style('stroke-width', 1)
  
  selection.append('text')
    .attr('x', width - margin.right)
    .attr('y', yScale(11.1))
    .attr('text-anchor', 'end')
    .attr('alignment-baseline', 'ideographic')
    .attr('fill', 'rgb(93, 128, 145)')
    .text('11.1%')

    
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
    .text('Distribution (%)')

  let legend = selection.append('g')
    .attr('class', 'legend-box')
    .attr('transform', `translate(420, 20)`)

  legend.append('rect')
    .attr('width', 150)
    .attr('height', 50)
    .style('border', `2px solid white`)
    .style('fill', "white")
    
  legend.append('circle')
    .attr('cx', 15)
    .attr('cy', 25)
    .attr('r', 5)
    .attr('fill', dotColor)
  
  legend.append('text')
    .attr('x', 25)
    .attr('y', 25)
    .attr('fill', axisLabelColor)
    .attr('text-anchor', 'start')
    .attr('alignment-baseline', 'central')
    .attr('font-weight', 'bold')
    .text('Benford\'s Law')

  selection.append('text')
    .attr('x', 590)
    .attr('y', 390)
    .attr('class', 'source-link')
    .attr('text-anchor', 'end')
    .attr('alignment-baseline', 'central')
    .style('fill', borderColor)
    .style('font-size', 10)
    .style('font-style', 'italic')
    .text(d => {
      return sourceURL ? `source: ${sourceURL}` : null
    })
    .on('mouseover', () => d3.select(event.currentTarget).style('fill', 'black'))
    .on('mouseout', () => d3.select(event.currentTarget).style('fill', borderColor))
    .on('click', () => window.open(sourceURL))

    function onMouseOver(e, d) {
      let sel = d3.select(this);
      let mouseX = d3.pointer(e)[0];
      let mouseY = d3.pointer(e)[1] - 100;

      sel.transition()
        .duration(200)
        .attr('x', d => xScale(d.digit) - 5)
        .attr('y', d => yScale((d.count/countTotal) * 100))
        .attr('width', xScale.bandwidth() + 10)
        .attr('height', d => yScale(0) - yScale((d.count/countTotal) * 100))
        .style('fill', '#00ADFF');
      
      let labelGroup = selection.append('g')
        .attr('class', 'mouseLabel');

      labelGroup.append('rect')
        .attr('class', 'val-rect val')
        .attr('width', 125)
        .attr('height', 75)
        .attr('x', mouseX)
        .attr('y', mouseY)
        .style('fill', 'rgba(200, 210, 220, .4)')

      labelGroup.append('text')
        .attr('class', 'val')
        // .style('fill', 'transparent')
        .selectAll('tspan')
        .style('fill', backgroundColor)
        .data(() => {
          let count = `${d.count} instances`;
          let total = `out of ${countTotal}`;
          let percentage = (d.count / countTotal * 100).toFixed(1) + "%";
          return [percentage, count, total];
        })
        .join('tspan')
        .attr('x', mouseX + 5)
        .attr('y', mouseY + 20)
        .text(d => d)
        .attr('dy', (d,i) => i === 1 ? '1.4em' : i === 2 ? '2.6em' : 0 )
        .style('font-weight', (d,i) => i === 0 ? 'bold' : undefined)
        .style('font-family', 'sans-serif')

    }

    function onMouseOut(d, i) {
      d3.select(this)
        .transition()
        .duration(200)
        .style('fill', barColor)
        .attr('x', d => xScale(d.digit))
        .attr('width', xScale.bandwidth())

      d3.selectAll('.val')
        .remove()
    }
}