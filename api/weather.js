
var fetch = require('node-fetch')

// the name of the route is /weather
// because that is the name of the file
module.exports = async (req, res) => {

  const state = req.query

  var key = '404b2a8c808e059e02639a871879b4bd'
  var url = `http://api.openweathermap.org/data/2.5/${state.page}?q=${state.text}&units=imperial&appid=${key}`
  
  try {
    var r = await fetch(url)
    var json = await r.json()
    res.status(200).json(json)
  } catch(e) {
    res.status(500).json({error: e.message})
  }

}