import React, {useState, useEffect} from 'react'
import {Container, Table, Alert, Button} from "react-bootstrap"
import {useParams, Link} from "react-router-dom"
import axios from 'axios';

function Hourly() {
    let { city, id } = useParams();
    const [state, setState] = useState();
    const [init, setInit] = useState(false);
    useEffect(() => {
        axios.get(`https://api.weatherapi.com/v1/forecast.json?key=28193ed4b743490692a92524212408&q=${city}&days=3`).then((response2) => setState(response2.data.forecast.forecastday[id].hour)).finally(() => setInit(true))
    }, [init, city, id])


    const capitilazeCityName = (city) => {
        let arr = city.split("_");
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        
        }
        return arr.join(" ")   
    }

    return (
        <Container>
    {
        init ? 

       <>
    <Alert variant="primary" className='text-center'>
    You're looking at hourly weather forecast of {capitilazeCityName(city)}. Please click <Link to="/"><Button size="sm">here</Button></Link> to go to homepage.
  </Alert>
 <Table striped bordered hover variant="dark">
 <thead className='text-center'>
   <tr >
     <th width="200">Time</th>
     <th width="200">Condition</th>
     <th width="200">Temperature</th>
     <th width="200">Humidty</th>
   </tr>
 </thead>
 <tbody>

{
   state.map((hour, i) => (
   <tr className='text-center' key={i}>
     <td>{hour.time.split(" ")[1]}</td>
     <td >{hour.condition.text} <img src={hour.condition.icon} alt="condition-icon"/></td>
     <td>{hour.temp_c} C&#176;</td>
     <td>{hour.humidity}%</td>
   </tr>
    ))
   
}
   
   </tbody>

   </Table> </>  : ""
    }
           
        </Container>
    )
}

export default Hourly
