import { Drash, Redis } from "../deps.ts";
import { BaseResource } from "../resources/base_resource.ts";

export class RedisWeatherResource extends BaseResource {
    client!: Redis.Redis;

    public paths = this.prefixPaths("api_v3", ["/current"]);

    constructor() {
        super();
        Redis
            .connect({
                hostname: Deno.env.get("REDIS_HOSTNAME") ?? "0.0.0.0",
                port: Deno.env.get("REDIS_PORT") ?? "6380",
            })
            .then(newClient => this.client = newClient);
    }

    public async GET(request: Drash.Request, response: Drash.Response) {
        const {city} = await request.json();

        if (!city)
            throw new Drash.Errors.HttpError(301, "city not stated");
        
        const existsUnit = await this.client.hexists(city, 'unit');
        const existsTemperature = await this.client.hexists(city, 'temperature');

        if (!existsUnit || !existsTemperature)
            throw new Drash.Errors.HttpError(404, "city not found");

        const unit = await this.client.hget(city, 'unit');
        const temperature = await this.client.hget(city, 'temperature');

        return response.json({
            city,
            unit,
            temperature
        });
    }

    public async PUT(request: Drash.Request, response: Drash.Response) {        
        const {city, unit = 'celsius', temperature} = await request.json();

        if (!city)
            throw new Drash.Errors.HttpError(301, "city not stated");

        if (!temperature)
            throw new Drash.Errors.HttpError(301, "temperature not stated");

        await this.client.hset(city, {unit, temperature});

        return response.json({message: 'weather set'});
    }
}