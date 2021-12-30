import axios from "axios"
import {useQuery} from "react-query"


const fetchCityByIp =  () => {
    return  axios.get("https://ip-geo-location.p.rapidapi.com/ip/check?format=json", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "ip-geo-location.p.rapidapi.com",
            "x-rapidapi-key": "a72edcbfaamsh96bf1fc7aee8f23p1c27fajsn74d1a5ffa4a4"
        }
    })
}

const fetchForecast = (city) => {
    return  axios.get(`https://api.weatherapi.com/v1/forecast.json?key=28193ed4b743490692a92524212408&q=${city}&days=3`);
    
}

export const DependentQueries = () => {
    const {data : city} = useQuery(["City Data"],fetchCityByIp)
    const cityName = city?.data.area.name

useQuery(['forecast', cityName], () => fetchForecast("istanbul"), {
        enabled: !!cityName 
    })
}


/* export const fetchCity = async () => {
const {data} = await axios.get("https://ip-geo-location.p.rapidapi.com/ip/check?format=json", {
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "ip-geo-location.p.rapidapi.com",
        "x-rapidapi-key": "a72edcbfaamsh96bf1fc7aee8f23p1c27fajsn74d1a5ffa4a4"
    }
})
return data
}

export const fetchForecast = async (city) => {
    const {data} = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=28193ed4b743490692a92524212408&q=${city.area.name}&days=3`);
    return data;
} */