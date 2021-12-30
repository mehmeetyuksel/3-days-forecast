import { createContext, useContext, useState } from "react";

const ForecastContext = createContext();

const ForecastProvider = ({ children }) => {


    const [forecast, setForecast] = useState([]);


    return <ForecastContext.Provider value={{ forecast, setForecast }}>{children}</ForecastContext.Provider>
}

const useForecast = () => useContext(ForecastContext)

export { ForecastProvider, useForecast }