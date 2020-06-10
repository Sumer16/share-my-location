import { Modal } from './UI/Modal';
import { Map } from './UI/Map';
import { getCoordsFromAddress, getAddressFromCoords } from './Utils/Location';
import { encode } from 'punycode';

class Placefinder{
  constructor() {
    const addressForm = document.querySelector('form');
    const locateUserBtn = document.getElementById('locate-btn');
    this.shareBtn = document.getElementById('share-btn');
    
    locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this));
    this.shareBtn.addEventListener('click', this.sharePlaceHandler.bind(this));
    addressForm.addEventListener('submit', this.findAddressHandler.bind(this));
  }

  sharePlaceHandler() {
    const sharedLinkInputEl = document.getElementById('share-link');
    if(!navigator.clipboard){
      sharedLinkInputEl.select();
      return;
    }

    navigator.clipboard.writeText(sharedLinkInputEl.value)
    .then(() => {
      alert('Copied on Clipboard');
    }).catch((err) => {
      alert('Could not copy, please use Ctrl + c');
      console.log(err);
      sharedLinkInputEl.select();
    });
  }

  selectPlace(coordinates, address) {
    if(this.map){
      this.map.render(coordinates);
    } else {
      this.map = new Map(coordinates);
    }
    // fetch('http://localhost:3000/add-location', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     address: address,
    //     lat: coordinates.lat,
    //     lng: coordinates.lng
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   }
    // }).then(res => {
    //   return res.json();
    // }).then(data => {
    //   console.log(data);
    // });
    this.shareBtn.disabled = false;
    const sharedLinkInputEl = document.getElementById('share-link');
    sharedLinkInputEl.value = `${location.origin}/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${coordinates.lng}`;
  }

  locateUserHandler() {
    if(!navigator.geolocation){
      alert('Location feature not available in this Browser! Please use a modern one or enter the location manually.');
      return;
    }
    const modal = new Modal('loading-modal-content', 'loading location - please wait!');
    modal.show();
    navigator.geolocation.getCurrentPosition(async successRes => {
      const coordinates = {
        lat: successRes.coords.latitude,
        lng: successRes.coords.longitude
      };
      const address = await getAddressFromCoords(coordinates);
      modal.hide();
      this.selectPlace(coordinates, address);
    }, error => {
      modal.hide();
      alert('Could not locate you Stranger. Please enter the address manually!');
    });
  }

  async findAddressHandler(e) {
    e.preventDefault();
    const address = event.target.querySelector('input').value;
    if(!address || address.trim().length === 0) {
      alert('Invalid Address entered, please try again!');
      return;
    }
    const modal = new Modal('loading-modal-content', 'loading location - please wait!');
    modal.show();
    try {
      const coordinates = await getCoordsFromAddress(address);
      this.selectPlace(coordinates, address);
    } catch(e) {
      alert(e.message);
    }
    modal.hide();
  }
}

const placer = new Placefinder();
