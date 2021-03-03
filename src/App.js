import React, {useState,useContext,useEffect} from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment'
import {Bar} from 'react-chartjs-2'
import context, {initialState} from './context'

function App() {

  const ctx = useContext(context)
  const {state, setState} = ctx
  const {weather, loading, error, text} = state

  async function getWeather(e) {
    // this line prevents the page from reloading (which is the default for <form> elements)
    e.preventDefault()
    // set "loading" to true in the state so we can show a spinner
    setState({loading: true, weather:null})
    // here is our giphy api key
    var key = '404b2a8c808e059e02639a871879b4bd'
    // this line make a URL string, I got this from their documentation
    var url = `http://api.openweathermap.org/data/2.5/forecast?q=${state.text}&units=imperial&appid=${key}`
    // "fetch" calls the giphy API!
    var r = await fetch(url)
    // this lines extracts JSON (javascript object notation)
    var json = await r.json()

    if(r.status===200){
      // set the weather in state, and loading to false, and the text to blank again
      setState({
        weather: json.list, 
        loading:false, 
        text:'', 
        error:null
      })
    } else {
      setState({
        error: json.message, 
        loading:false
      })
    }
  }

  var data

  if(weather){
    data = {
      labels: weather.map(w=> moment(w.dt*1000).format('ll hh:mm a')),
      datasets: [{
        label:'Temperature',
        borderWidth: 1,
        data: weather.map(w=> w.main.temp),
        backgroundColor: 'rgba(132,99,255,0.2)',
        borderColor: 'rgba(132,99,255,1)',
        hoverBackgroundColor: 'rgba(132,99,255,0.4)',
        hoverBorderColor: 'rgba(132,99,255,1)',
      }]
    }
  }

  return (
    <div className="App">
      <form className="App-header" onSubmit={getWeather}>
        <TextField value={text}
          autoFocus
          variant="outlined"
          label="Search for weather"
          onChange={e=> setState({text: e.target.value})}
          style={{width:'100%',marginLeft:8}}
        />
        <Button variant="contained"
          color="primary"
          disabled={loading || !text} 
          type="submit"
          style={{width:150, margin:'0 10px', height:75}}>
          <SearchIcon style={{marginRight:8}} />
          Search
        </Button>
      </form>
      {loading && <LinearProgress />}
      <main>
        {data && <Bar
          data={data}
          width={800}
          height={400}
        />}
        {error && <div style={{color:'rgb(150,80,50)'}}>{error}</div>}
      </main>

      <Another />
    </div>
  );
}

function Another() {
  const ctx = useContext(context)
  return <h1 onClick={()=>ctx.setState({text:'I clicked!'})}>
    {ctx.state.text}
  </h1>
}

export default App;
