var NodeGeocoder = require('node-geocoder');

//Defining options

var options = {
  provider: 'google',
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: '********************************', // for Google API
  formatter: null         //  string'
};

var appGeocoder = NodeGeocoder(options);

//Function definition
const getLatLong = (address) => {
  return new Promise((resolve, reject) => {
    appGeocoder.geocode({ address: address, country: 'India', city: 'Chandigarh' }, (err, result) => {
      if (err) {
        reject(err);
      }
      if (!result || result[0] == undefined) {
        reject('NOT FOUND');
      } else {
        const arrayLatLong = [result[0].longitude, result[0].latitude];
        resolve(arrayLatLong);
      }
    });
  });
}

//Function export
module.exports.getLatLong = getLatLong;
