const express = require('express');
const https = require('https')
//const axios = require('axios');
const app = express();
const cors = require('cors');
const { response } = require('express');
app.use(cors())
// Endpoint to handle keyword suggestions
const apikey = '91kZXohl7W5KlMWd2QWr0LefCZWnJolC'

app.get('/suggest', async (req, res) => {
  const { keyword } = req.query;
  // Check if keyword is missing or empty
  if (!keyword) {
    res.status(400).send('Keyword is required');
    return;
  }

  try {
    // Make request to Ticketmaster API
    
    const suggestApiLink = `https://app.ticketmaster.com/discovery/v2/suggest?apikey=${apikey}&keyword=${keyword}`
    
    https.get(suggestApiLink, (response) => { 
      let apidata = '';

      response.on('data', (chunk) => {
        apidata += chunk;
      });
      
      response.on('end', () => {
        console.log(apidata)
        console.log('response reached');
        const data = JSON.parse(apidata);
        
        //res.json(data)

        res.json(data._embedded.events);
        
        console.log(data._embedded.events)
      });

    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// // Endpoint to handle event search

app.get('/events', async (req, res) => {
  const { keyword, distance, category, locationQuery } = req.query;

  try {
    const options = {
      hostname: 'app.ticketmaster.com',
      path: `/discovery/v2/events.json?size=20apikey=9kZXoh1l7W5KlMWd2QWr0LefCZWnJolC&keyword=${keyword}&radius=${distance}&classificationName=${category}&geoPoint=${locationQuery}`,
      method: 'GET'
    };

    const request = https.request(options, (response) => {
      let body = '';

      response.on('data', (chunk) => {
        body += chunk;
      });

      response.on('end', () => {
        const data = JSON.parse(body);
        const events = data._embedded && data._embedded.events
          ? data._embedded.events
          : [];
        res.json({ events });
      });
    });

    request.on('error', (error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });

    request.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
