import React from 'react';
import * as topojson from 'topojson-client';
import {geoPath, geoCentroid, geoMercator} from 'd3-geo';
// import Voronoi from '../js/Voronoi';

class MapsCard extends React.Component {
  constructor(props) {
    super(props);

    this.districtMapping = {
      "Varanasi":"वाराणसी","Unnao":"उन्नाव","Sultanpur":"सुल्तानपुर","Sonbhadra":"सोनभद्र","Sitapur":"सीतापुर","Siddharth Nagar":"सिद्धार्थ नगर","Shravasti":"श्रावस्ती","Shamli":"शामली","Shahjahanpur":"शाहजहांपुर","Sant Kabir Nagar":"संत कबीर नगर","Sambhal":"संभल","Saharanpur":"सहारनपुर","Rampur":"रामपुर","Raebareli":"रायबरेली","Pratapgarh":"प्रतापगढ़","Pilibhit":"पीलीभीत","Muzaffarnagar":"मुजफ्फरनगर","Moradabad":"मुरादाबाद","Mirzapur":"मिर्जापुर","Meerut":"मेरठ","Mau":"मऊ","Mathura":"मथुरा","Mainpuri":"मैनपुरी","Mahoba":"महोबा","Maharajganj":"महाराजगंज","Lucknow":"लखनऊ","Lalitpur":"ललितपुर","Lakhimpur Kheri":"लखीमपुर खीरी","Kushinagar":"कुशीनगर","Kaushambi":"कौशाम्बी","Kasganj":"कासगंज","Kanpur Nagar":"कानपूर नगर","Kanpur Dehat":"कानपूर देहात","Kannauj":"कन्नौज","Jhansi":"झांसी","Jaunpur":"जौनपुर","Jalaun":"जालौन","Hathras":"हाथरस ","Hardoi":"हरदोई","Hapur":"हापुड़","Hamirpur":"हमीरपुर","Gorakhpur":"गोरखपुर","Gonda":"गोण्डा","Ghazipur":"गाज़ीपुर","Ghaziabad":"गाज़ियाबाद","Gautam Buddha Nagar":"गौतम बुद्धा नगर","Firozabad":"फिरोज़ाबाद","Fatehpur":"फतेहपुर","Farrukhabad":"फर्रूखाबाद","Faizabad":"फैज़ाबाद","Etawah":"इटावा","Etah":"एटा","Deoria":"देवरिया","Chitrakoot":"चित्रकूट","Chandauli":"चन्दौली","Bulandshahar":"बुलन्दशहर","Budaun":"बदायूँ","Bijnor":"बिजनौर","Bhadohi":"भदोही ","Basti":"बस्ती","Bareilly":"बरेली","Barabanki":"बाराबंकी","Banda":"बाँदा","Balrampur":"बलरामपुर","Ballia":"बलिया","Bahraich":"बहराइच","Baghpat":"बागपत","Azamgarh":"आज़मगढ़","Auraiya":"औरैया","Amroha":"अमरोहा","Amethi":"अमेठी","Ambedkar Nagar":"अम्बेडकरनगर","Allahabad":"इलाहाबाद","Aligarh":"अलीगढ़","Agra":"आगरा"
    };

    this.all_districts = ["Agra","Aligarh","Allahabad","Ambedkar Nagar","Amethi","Amroha","Auraiya","Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahar","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Faizabad","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kushinagar","Lakhimpur Kheri","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Raebareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti","Siddharth Nagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"];

    let districts_water_score = {};
        // districts_in_data = this.props.dataJSON.map((e, i) => e.district),
        // hidden_districts = this.arrayDifference(districts_in_data, this.all_districts);

    this.props.dataJSON.forEach((e,i) => {
      districts_water_score[e.district] = e.water_score;
    });

    this.state = {
      projection: undefined,
      regions: [],
      outlines: [],
      country: undefined,
      path: undefined,
      offsetWidth: undefined,
      actualHeight: undefined,
      x:'100px',
      y:'100px',
      showTooltip:false,
      waterScore: districts_water_score,
      // hideDistricts: hidden_districts,
      districts: this.all_districts
    }
  }

  // arrayDifference(newArr, oldArr) {
  //   return oldArr.filter((e, i) => {
  //     return !newArr.find((f, j) => { return f === e})
  //   })
  // }

  // handleOnClick(e, card) {
  //   let props = this.props;
  //   $('.ui.modal').modal({
  //     onShow: function() {
  //       $("#proto-modal").css("height", 0)
  //     },
  //     onHide: function(){
  //       if (props.mode === 'laptop') {
  //         $("#proto-modal").css("height", "100%")
  //       }
  //     },
  //     onHidden: function(e) {
  //       let element = document.querySelector("#proto-embed-card iframe");
  //       element.parentNode.removeChild(element);
  //     }
  //   }).modal('attach events', '.close').modal('show')
  //   if (this.props.mode === 'laptop'){
  //     let pro = new ProtoEmbed.initFrame('proto-embed-card', card.iframe_url, "laptop")
  //   } else {
  //     let pro = new ProtoEmbed.initFrame('proto-embed-card', card.iframe_url, "mobile")
  //   }
  // }

  handleMouseMove (e,d) {
    e.target.style.stroke = "#ffffff";
    // e.target.style.fill='#007cd7';
    // e.target.style.fillOpacity='unset';
    let rect = e.target.getBoundingClientRect();
    let mx=e.pageX;
    let my=e.pageY;
    let cont = document.getElementById('map_and_tooltip_container'),
      bbox = cont.getBoundingClientRect();
    this.setState({
      showTooltip:true,
      x: mx - bbox.left + 15,
      y: my - window.pageYOffset - bbox.top - 5,
      currState:d.properties.NAME_1
    });
  }

  handleMouseOut (e,d){
    e.target.style.stroke = "none";
    // e.target.style.fillOpacity='0';
    this.setState({
      showTooltip:false,
      x: 0,
      y: 0
    })
  }

  // handleMouseClick(e,d){
  //   if(!this.props.modal){
  //     let location = d.properties.NAME_1.toLowerCase().split(' ').join('-');
  //     window.location = './districts/'+location+'.html';
  //   }
  //   // else{
  //   //   let district = document.querySelector('#protograph_tooltip').innerHTML;
  //   //   this.handleOnClick(e,this.props.dataJSON[this.state.districts.indexOf(district)%this.props.dataJSON.length])
  //   // }
  // }

  // componentWillReceiveProps(nextProps) {
  //   let districts_in_data = nextProps.dataJSON.map((e,i) => e.district),
  //     hidden_districts = this.arrayDifference(districts_in_data, this.all_districts);


  //   this.setState({
  //     hideDistricts: hidden_districts
  //   }, this.componentWillMount);
  // }

  componentWillMount() {
    let padding = this.props.mode === 'mobile' ? 20 : 0,
      offsetWidth = this.props.mode === 'mobile' ? 300 : 550 - padding ,
      actualHeight = this.props.mode === 'mobile' ? 500 : this.props.chartOptions.height

    let tx = this.props.mode === 'mobile' ? offsetWidth / 2 : offsetWidth / 2;
    let ch = this.props.topoJSON,
      country = topojson.feature(ch, ch.objects),
      center = geoCentroid(topojson.feature(ch, ch.objects)),
      scale = 700,
      projection = geoMercator().center(center)
        .scale(scale)
        .translate([tx, actualHeight/2]),
      path = geoPath()
        .projection(projection);

    let bounds  = path.bounds(country),
      hscale = scale*offsetWidth  / (bounds[1][0] - bounds[0][0]),
      vscale = scale*actualHeight / (bounds[1][1] - bounds[0][1]);
    scale = (hscale < vscale) ? hscale : vscale;
    let offset = [offsetWidth - (bounds[0][0] + bounds[1][0])/2, actualHeight - (bounds[0][1] + bounds[1][1])/2];

    projection = geoMercator().center(center)
      .scale(scale)
      .translate(offset);
    path = path.projection(projection);

    let regions = country.features.map((d,i) => {
      return(
        <g key={i} className="region">
          <path className="geo-region" d={path(d)}></path>
        </g>
      )
    })

    let outlines = country.features.map((d,i) => {
      let score = this.state.waterScore[this.districtMapping[d.properties.NAME_1]],
        heat_color = score === 'कठिन' ? 'protograph-bad-heat-color' : 'protograph-good-heat-color';

      // let is_hidden = this.state.dataJSON.data.indexOf(d.properties.NAME_1) !== -1;
      return(
        <path
          key={i}
          className={`geo region-outline ${heat_color} protograph-trigger-modal`}
          d={path(d)}
          data-district_code={d.properties.NAME_1}
          onClick={this.props.showModal}
          onMouseOut={((e) => this.handleMouseOut(e, d))}
          onMouseMove={((e) => this.handleMouseMove(e, d))}
        />
      )
    })

    this.setState({
      projection: projection,
      regions: regions,
      outlines: outlines,
      country: country,
      path: path,
      offsetWidth: offsetWidth,
      actualHeight: actualHeight
    })
  }

  render(){
    let styles = {
      strokeWidth: 0.675
    }
    const {projection, regions, outlines, country, path, offsetWidth, actualHeight} = this.state
    return(
      <div id="map_and_tooltip_container" style={{width:'100%',height:'100%',position:'relative', display: 'inline-block', 'textAlign': 'center'}}>
        <svg id='map_svg' viewBox={`0, 0, ${offsetWidth}, ${actualHeight}`} width={offsetWidth} height={actualHeight+60}>
          <g id="regions-grp" className="regions">{regions}</g>
          <path className='geo-borders' d={path(country)}></path>
          <g className="outlines" style={styles}>{outlines}</g>
        </svg>
        {this.state.showTooltip ? <div id="protograph_tooltip" style={{left:this.state.x,top:this.state.y}}>
          {this.districtMapping[this.state.currState]}
        </div> : ''}
      </div>
    )
  }
}

export default MapsCard;