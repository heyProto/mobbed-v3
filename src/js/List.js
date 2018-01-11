import React from 'react';
import Modal from './Modal.js';
import Utils from './utility.js';

class ListCards extends React.Component {

  constructor (props) {
    super(props);

    let stateVar = {
      no_of_cards: 30,
      cardsInRow: window.innerWidth <= 500 ? 2 : 6,
      cardsVisible: this.props.dataJSON.slice(0, 30)
    };

    this.districtMapping = {
      "Agra":"आगरा","Aligarh":"अलीगढ़","Allahabad":"इलाहाबाद","Ambedkar Nagar":"अंबेडकर नगर","Amethi":"अमेठी","Amroha":"अमरोहा","Auraiya":"औरैया","Azamgarh":"आजमगढ़","Baghpat":"बागपत","Bahraich":"बहराइच","Ballia":"बलिया","Balrampur":"बलरामपुर","Banda":"बांदा","Barabanki":"बाराबंकी","Bareilly":"बरेली","Basti":"बस्ती","Bhadohi":"भदोही","Bijnor":"बिजनौर","Budaun":"शाहजहांपुर","Bulandshahar":"बुलंदशहर","Chandauli":"चंदौली","Chitrakoot":"चित्रकूट","Deoria":"देवरिया","Etah":"एटा","Etawah":"इटावा","Faizabad":"फैजाबाद","Farrukhabad":"फर्रुखाबाद","Fatehpur":"फतेहपुर","Firozabad":"फिरोजाबाद","Gautam Buddha Nagar":"गौतम बुद्ध नगर","Ghaziabad":"गाज़ियाबाद","Ghazipur":"गाजीपुर","Gonda":"गोंडा","Gorakhpur":"गोरखपुर","Hamirpur":"हमीरपुर","Hapur":"हापुड़","Hardoi":"हरदोई","Hathras":"हाथरस","Jalaun":"जालौन","Jaunpur":"जौनपुर","Jhansi":"झांसी","Kannauj":"कन्नौज","Kanpur Dehat":"कानपुर देहात","Kanpur Nagar":"कानपुर नगर","Kasganj":"कासगंज","Kaushambi":"कौशाम्बी","Kushinagar":"कुशीनगर","Lakhimpur Kheri":"लखीमपुर खेरी","Lalitpur":"ललितपुर","Lucknow":"लखनऊ","Maharajganj":"महाराजगंज","Mahoba":"महोबा","Mainpuri":"मैनपुरी","Mathura":"मथुरा","Mau":"मऊ","Meerut":"मेरठ","Mirzapur":"मिर्जापुर","Moradabad":"मुरादाबाद","Muzaffarnagar":"मुजफ्फरनगर","Pilibhit":"पीलीभीत","Pratapgarh":"प्रतापगढ़","Raebareli":"रायबरेली","Rampur":"रामपुर","Saharanpur":"सहारनपुर","Sambhal":"संभल","Sant Kabir Nagar":"संत कबीर नगर","Shahjahanpur":"शाहजहांपुर","Shamli":"शामली","Shravasti":"श्रावस्ती","Siddharth Nagar":"सिद्धार्थ नगर","Sitapur":"सीतापुर","Sonbhadra":"सोनभद्र","Sultanpur":"सुल्तानपुर","Unnao":"उन्नाव","Varanasi":"वाराणसी"
    };

    this.state = stateVar;
  }

  componentDidMount(prevProps, prevState) {
    $('.protograph-grid-card').each((i, element) => {
      let iframe_url = element.getAttribute('data-iframe_url');
      setTimeout(function () {
        new ProtoEmbed.initFrame(element, iframe_url, "grid");
      }, 0);
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      cardsVisible: nextProps.dataJSON.slice(0, this.state.no_of_cards)
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let cards = [].slice.call(document.querySelectorAll('.protograph-grid-card')),
      newCards;

    newCards = cards.filter((e,i) => {
      return !e.querySelector('iframe');
    });

    newCards.forEach((element,i) => {
      let iframe_url = element.getAttribute('data-iframe_url');
      setTimeout(function () {
        new ProtoEmbed.initFrame(element, iframe_url, "grid");
      }, 0);
    });
  }

  loadMoreCard() {
    let size = this.props.dataJSON.length;
    let x = (this.state.no_of_cards + this.state.no_of_cards <= size) ? this.state.no_of_cards + this.state.no_of_cards : size;

    this.setState({
      no_of_cards : x,
      cardsVisible: this.props.dataJSON.slice(0, x)
    })
  }

  render() {
    if (this.props.dataJSON.length === 0) {
      return(<h2>दिखाने के लिए कोई कार्ड नहीं</h2>)
    } else {
      let cards = this.state.cardsVisible.map((card, i) => {
        let class_name = (((i+1)% this.state.cardsInRow) == 0) ? "protograph-card div-without-margin-right" : "protograph-card";
        return(
          <div
            key={`${card.district}_i`}
            id={`protograph-grid-card-${card.view_cast_id}`}
            data-viewcast_id={card.view_cast_id}
            className={`protograph-grid-card protograph-trigger-modal ${class_name}`}
            data-iframe_url={card.iframe_url}
            data-district_code={card.district_code}
            onClick={this.props.showModal}
          >
            <div className="protograph-grid-card-interaction-overlay" />
          </div>
        )
      })
      return (
        <div id="cards-list" className="protograph-card-area">
          {cards}
          <div className="clearfix"></div>
          {this.state.no_of_cards < this.props.dataJSON.length ? <button id="show-more-cards" onClick={(e) => this.loadMoreCard()}>Show more</button> : null}
        </div>
      )
    }
  }
}

export default ListCards;