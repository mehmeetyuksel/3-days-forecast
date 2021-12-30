import React from 'react'
import '../App.css';
import { Row, Container, InputGroup, FormControl, Button, Card, Table, Spinner } from "react-bootstrap"
import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"
import logo from "../img/logo.png"
import { useQuery } from "react-query"
import { useForecast } from "../context/ForecastContext"


function Homepage() {
    const [city, setCity] = useState([])
    const { forecast, setForecast } = useForecast();


    const { isLoading, isError, error } = useQuery(
        "gitUsers",
        async () => {
            return await axios.get("https://ip-geo-location.p.rapidapi.com/ip/check?format=json", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "ip-geo-location.p.rapidapi.com",
                    "x-rapidapi-key": "a72edcbfaamsh96bf1fc7aee8f23p1c27fajsn74d1a5ffa4a4"
                }
            }).then(async (res) => {
                await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=28193ed4b743490692a92524212408&q=${res.data.city.name}&days=3`).then((response) => setForecast(response))
            }
            );
        },
        {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchInterval: false
        }
    );

    if (isLoading) {
        return (
            <Container className="text-center">
                <Spinner style={{ height: "300px", width: "300px" }} animation="border" />
            </Container>)
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    const handleChange = (cityValue) => {
        setCity(cityValue);
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            if (e.target.value === "") {
                alert("Enter a value"); e.preventDefault()
            }

            else {
                getCityForecast(e.target.value)
                e.target.value = "";

            }
        }
    }
    const getCityForecast = (city) => {
        axios.get(`https://api.weatherapi.com/v1/forecast.json?key=28193ed4b743490692a92524212408&q=${city}&days=3`).then((response) => setForecast(response)).catch((err) => alert("Unvalid city name. Please use English names."));
    }
    return (

        <div className="app">
            {


                <Container>

                    <Row className='justify-content-center'>
                        <img src={logo} className="logo mt-5" alt="logo"></img>
                    </Row>

                    <Row className="mt-3 justify-content-center">
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Text id="inputGroup-sizing-sm"  >Enter a city name</InputGroup.Text>
                            <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm"  onChange={(e) => handleChange(e.target.value)} onKeyDown={handleKeyPress} />
                            <Button variant="info" className="btn" id="button-addon2" onClick={() => getCityForecast(city.trim())}>
                                Search
                            </Button>
                        </InputGroup>
                    </Row>
                    <Row className="text-center">
                        <h1>{forecast.data.location.name}, {forecast.data.location.country}, {forecast.data.location.localtime.split(" ")[1]}</h1>
                    </Row>

                    <Row className="justify-content-evenly mt-3">
                        {
                            forecast.data.forecast.forecastday.map((data, index) =>

                                <Card style={{ width: '20rem' }} key={index} className="justify-content-center text-center mb-3">
                                    <Link to={`/${forecast.data.location.name}/${index}`}>
                                        <Card.Img variant="top" style={{ width: '5rem' }} className="mx-auto" src={data.day.condition.icon} />
                                        <Card.Body>
                                            <Card.Title>{data.date.split("-").reverse().splice(0, 2).join("/")}, {data.day.condition.text} </Card.Title>

                                            <Table striped bordered hover size="sm">
                                                <thead>
                                                    <tr>

                                                        <th>Condition</th>
                                                        <th>Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-start">

                                                    <tr>
                                                        <td>Avarage Temperature</td>
                                                        <td>{data.day.avgtemp_c} C&#176;</td>
                                                    </tr>

                                                    <tr>
                                                        <td>Minimum Temperature </td>
                                                        <td>{data.day.mintemp_c} C&#176;</td>
                                                    </tr>

                                                    <tr>
                                                        <td>Maximum Temperature </td>
                                                        <td>{data.day.maxtemp_c} C&#176;</td>
                                                    </tr>

                                                    <tr>
                                                        <td>Maximum Wind</td>
                                                        <td>{data.day.maxwind_kph}km/hr</td>
                                                    </tr>
                                                </tbody>
                                            </Table>

                                        </Card.Body>
                                    </Link>
                                </Card>
                            )
                        }
                    </Row>





                </Container>

            }
        </div>

    )
}

export default Homepage
