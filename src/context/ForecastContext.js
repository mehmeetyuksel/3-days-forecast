import { createContext, useContext, useState } from "react";

const ForecastContext = createContext();

const ForecastProvider = ({ children }) => {


    const [forecast, setForecast] = useState([]);
    const [favs, setFavs] = useState([]);


    return <ForecastContext.Provider value={{ forecast, setForecast, favs, setFavs }}>{children}</ForecastContext.Provider>
}

const useForecast = () => useContext(ForecastContext)

export { ForecastProvider, useForecast }