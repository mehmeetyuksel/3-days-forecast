import React from 'react'
import '../App.css';
import { Row, Container, Col, InputGroup, FormControl, Button, Card, Table, Spinner, Offcanvas } from "react-bootstrap"
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import logo from "../img/logo.png"
import { useQuery } from "react-query"
import { useForecast } from "../context/ForecastContext"


function Homepage() {
    const [city, setCity] = useState([])
    const { forecast, setForecast, favs, setFavs } = useForecast();
    useEffect(() => {
        console.log(favs)
    }, [favs])


    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const inputRef = useRef()


    const { isLoading, isError, error } = useQuery(
        "gitUsers",
        async () => {
            return await axios.get("https://ip-geo-location.p.rapidapi.com/ip/check?format=json", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "ip-geo-location.p.rapidapi.com",
                    "x-rapidapi-key": `${process.env.REACT_APP_IP_API_KEY}`
                }
            }).then(async (res) => {
                setCity(res.data.city.name);
                await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_FORECAST_API_KEY}&q=${res.data.city.name}&days=3`).then((response) => setForecast(response))
            }
            );
        },
        {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: true,
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
                alert("Enter a value");
                e.preventDefault()
            }

            else {
                getCityForecast(e.target.value)
                e.target.value = "";

            }
        }
    }
    const getCityForecast = async (city) => {
        await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=28193ed4b743490692a92524212408&q=${city}&days=3`).then((response) => setForecast(response)).catch((err) => alert("Unvalid city name. Please use English names.")).finally(setCity(city));
        inputRef.current.value = "";
    }


    const setFavorite = (city) => {
        setFavs([...favs, city])

    }
    const deleteFavorite = (city) => {
        let newArr = [...favs];
        let filteredArr = newArr.filter(el => el !== city);
        setFavs(filteredArr);
    }


    return (

        <div className="app">
            {
                <Container>


                    <div className="text-center">
                        <Button className="btn btn-sm" variant="danger" onClick={handleShow}>
                            Favorite Cities
                        </Button>

                        <Offcanvas show={show} onHide={handleClose} >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title >Your Favorite Cities</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                {
                                    favs.map((el) => (
                                        <div className='mb-3'>
                                            <Button variant={`${city.toLowerCase() === el.toLowerCase() ? "danger" : "outline-danger"}`} style={{ width: "10rem", marginRight: ".4rem" }} onClick={() => getCityForecast(el)}>{el}</Button>
                                            <Button variant="danger" onClick={() => deleteFavorite(el)}>X</Button> <br />
                                        </div>
                                    ))
                                }
                            </Offcanvas.Body>
                        </Offcanvas>
                    </div>




                    <Row className='justify-content-center'>
                        <img src={logo} className="logo mt-5" alt="logo"></img>
                    </Row>

                    <Row className="mt-3 justify-content-center">
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Text id="inputGroup-sizing-sm"  >Enter a city name</InputGroup.Text>
                            <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm" ref={inputRef} onChange={(e) => handleChange(e.target.value)} onKeyDown={handleKeyPress} />
                            <Button variant="info" className="btn" id="button-addon2" onClick={() => getCityForecast(city.trim())}>
                                Search
                            </Button>
                        </InputGroup>
                    </Row>
                    <Row className="text-center">
                        <Col>
                            <h1>{forecast.data.location.name}, {forecast.data.location.country}, {forecast.data.location.localtime.split(" ")[1]}</h1>

                            {
                                favs.includes(forecast.data.location.name) ?
                                    <Button className="btn btn-sm btn-danger" style={{width: "5rem"}} onClick={() => deleteFavorite(forecast.data.location.name)}>Remove</Button>
                                    : <Button className="btn btn-sm btn-primary" style={{width: "5rem"}} onClick={() => setFavorite(forecast.data.location.name)}>Favorite</Button>
                            }

                        </Col>


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
