const { Router } = require('express');
const axios = require('axios');

const MOCK_API_URL = 'http://5b840ba5db24a100142dcd8c.mockapi.io/api';
const LOCATION_API_URL = 'https://api.opencagedata.com/geocode/v1';

const mockApi = axios.create({ baseURL: MOCK_API_URL, timeout: 10000 });
const locationApi = axios.create({ baseURL: LOCATION_API_URL, timeout: 10000 });

const getLocalization = (latitude, longitude) => locationApi
  .get(`/json?key=552418c3528043d8ba2ec332701fce2e&q=${latitude},${longitude}`);

const handleEvent = async (e) => {
  const locationRequest = await getLocalization(e.latitude, e.longitude);
  if (locationRequest.status !== 200) return e;
  return { ...e, location: locationRequest.data.results[0] };
};

module.exports = Router()
  .get('/events', async (req, res) => {
    try {
      const eventsRequest = await mockApi.get('/events');
      const events = await Promise.all(eventsRequest.data.map(handleEvent));
      return res.status(200).send(events);
    } catch (error) {
      return res.status(400).send({ msg: 'error to get events' });
    }
  })

  .post('/events/checkin', async (req, res) => {
    try {
      const events = await mockApi.post('/checkin', req.body);
      return res.status(200).send(events);
    } catch (error) {
      return res.status(400).send({ msg: 'error to get events' });
    }
  })

  .get('/localization', async (req, res) => {
    try {
      const { latitude, longitude } = req.query;
      const location = await getLocalization(latitude, longitude);
      return res.status(200).send(location.data.results[0]);
    } catch (error) {
      return res.status(400).send({ msg: 'error to get events' });
    }
  });
