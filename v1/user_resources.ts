import { Drash, dayjs } from "../deps.ts";
import { BaseResource } from "../resources/base_resource.ts";
import { capitalize } from "../utils.ts";

try {
    // Test env vars 
    if (!Deno.env.get("WEATHER_API"))
        throw new Error("WEATHER_API not set");
    if (!Deno.env.get("WEATHER_API_APPID"))
        throw new Error("WEATHER_API_APPID not set");
    if (!Deno.env.get("WEATHER_GEOCODING_API"))
        throw new Error("WEATHER_GEOCODING_API not set");
} catch (error) {
    console.error(error);
    Deno.exit(-1);
}

export type GeocodingResponse = Array<{
    name: string,
    lat: number,
    lon: number,
}>

const getLatLonByName = async (city: string) => {
    const res = await fetch(
        `${Deno.env.get('WEATHER_GEOCODING_API')}/direct?q=${city.toLowerCase()}&appid=${Deno.env.get('WEATHER_API_APPID')}`,
        {method: 'GET'}
    );
    if (res.status !== 200)
        throw new Error("failed");
    const data = await res.json() as GeocodingResponse;
    return data[0];
}

export type CurrentWeatherResponse = {
    city: {
        id: number,
        name: string
    },
    main: { temp: number }
}

export class CurrentWeatherResource extends BaseResource {
    public paths = this.prefixPaths("api_v1", ["/current"]);

    public async GET(request: Drash.Request, response: Drash.Response) {
        const city = request.queryParam('city');
        if (!city)
            return response.json({ message: "City not set" }, 500);


        const {lat, lon} = await getLatLonByName(city.toLowerCase());
        const res = await fetch(
            `${Deno.env.get('WEATHER_API')}/weather?lat=${lat}&lon=${lon}&appid=${Deno.env.get('WEATHER_API_APPID')}&units=metric`,
            { method: 'GET' }
        );
        if (res.status !== 200)
            throw new Error("failed");
        
        const body = await res.json() as CurrentWeatherResponse;
    
        return response.json({
            city: capitalize(city),
            unit: 'celsius',
            temperature: body.main.temp
        });
    }
}

export type ForecastWeatherResponse = {
    city: CurrentWeatherResponse['city'],
    daily: Array<{
        dt: number,
        temp: Record<'day' | 'min' | 'max' | 'night' | 'eve' | 'morn' , number>,
    }>
}

export class FutureWeatherResource extends BaseResource {
    public paths = this.prefixPaths("api_v1", ["/forecast"]);

    public async GET(request: Drash.Request, response: Drash.Response) {
        const city = request.queryParam('city');
        if (!city) return response.json({ message: "City not set" }, 500);

        const dt = request.queryParam('dt');
        if (!dt) return response.json({ message: "Timestamp not set" }, 500);

        const now = dayjs();
        const toFind = dayjs(Number(dt));
        if (toFind.isAfter(now.add(7, 'day')) || toFind.isBefore(now))
            return response.json({ message: "Can't forecast more than 7 days ahead or days before today" }, 500);

        const {lat, lon} = await getLatLonByName(city.toLowerCase());
        const res = await fetch(
            `${Deno.env.get('WEATHER_API')}/onecall?lat=${lat}&lon=${lon}&appid=${Deno.env.get('WEATHER_API_APPID')}&units=metric&exclude=current`,
            { method: 'GET' }
        );
        if (res.status !== 200)
            throw new Error("failed");

        const body = await res.json() as ForecastWeatherResponse;

        const found = body.daily.find(day => dayjs(day.dt * 1000).isSame(toFind, 'day'));
        if (!found)
            return response.json({ message: "Failed to found day" }, 404);

        return response.json({
            city: capitalize(city),
            unit: 'celsius',
            temperature: found.temp.eve
        });
    }
}