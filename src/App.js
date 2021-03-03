import React, {useState,useContext,useEffect} from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment'
import {Bar} from 'react-chartjs-2'
import context, {initialState} from './context'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";

function App() {

  const ctx = useContext(context)
  const {state, setState} = ctx
  const {loading, text} = state

  async function getWeather(e) {
    // this line prevents the page from reloading (which is the default for <form> elements)
    e.preventDefault()
    // set "loading" to true in the state so we can show a spinner
    setState({loading: true, weather:null})
    // here is our giphy api key
    var key = '404b2a8c808e059e02639a871879b4bd'
    // this line make a URL string, I got this from their documentation
    var url = `http://api.openweathermap.org/data/2.5/${state.page}?q=${state.text}&units=imperial&appid=${key}`
    // "fetch" calls the giphy API!
    var r = await fetch(url)
    // this lines extracts JSON (javascript object notation)
    var json = await r.json()

    console.log("JSON", json)
    if(r.status===200){
      // set the weather in state, and loading to false, and the text to blank again
      if (state.page==='forecast') {
        setState({
          weather: json.list, 
          loading:false, 
          error:null
        })
      } else if(state.page==='weather') {
        const w = json.weather[0]
        setState({
          current: {
            ...json.main, ...w
          },
          loading:false, 
          error:null
        })
      }
    } else {
      setState({
        error: json.message, 
        loading:false
      })
    }
  }

  return (<BrowserRouter>
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

      <Tabs variant="fullWidth"
        value={state.page}
        onChange={(e,page)=> setState({page})}
      >
        <Tab label="forecast" value="forecast" component={Link} to="/forecast" />
        <Tab label="current" value="weather" component={Link} to="/current" />
      </Tabs>

      <Switch>
        <Route path="/forecast" exact>
          <Forecast />
        </Route>
        <Route path="/current" exact>
          <Current />
        </Route>
      </Switch>
      
    </div>
  </BrowserRouter>);
}

function Current(){
  const ctx = useContext(context)
  const {state} = ctx
  if(!state.current) return <span />
  return <div>
    <p><strong>{state.current.description}</strong></p>
    <p>{`Temperature: ${state.current.temp}`}</p>
    <img height="100" src={`http://openweathermap.org/img/wn/${state.current.icon}@2x.png`}/>
  </div>
}

function Forecast(){
  const ctx = useContext(context)
  const {state} = ctx
  const {weather, error} = state

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

  return <main>
    {data && <Bar
      data={data}
      width={800}
      height={400}
    />}
    {error && <div style={{color:'rgb(150,80,50)'}}>{error}</div>}
  </main>
}

export default App;
