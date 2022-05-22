import { Drash, Redis } from "../deps.ts";
import { BaseResource } from "../resources/base_resource.ts";

export class RedisWeatherResource extends BaseResource {
    client!: Redis.Redis;

    public paths = this.prefixPaths("api_v3", ["/current"]);

    constructor() {
        super();
        console.log("Connecting redis...")
        Redis
            .connect({ hostname: "twemproxy", port: 6379 })
            .then(newClient => this.client = newClient)
            .catch(err => console.log(err));
    }

    public async GET(request: Drash.Request, response: Drash.Response) {
        const city = request.queryParam("city");

        if (!city)
            throw new Drash.Errors.HttpError(301, "city not stated");
        
        const data = (await this.client.get(city))?.toString();

        if (!data)
            throw new Drash.Errors.HttpError(404, "city not found");

        const { unit, temperature } = JSON.parse(data);

        return response.json({
            city,
            unit,
            temperature
        });
    }

    public async PUT(request: Drash.Request, response: Drash.Response) {        
        const city = request.bodyParam<string>("city");
        const unit = request.bodyParam<string>("unit") ?? 'celsius';
        const temperature = request.bodyParam<number>("temperature");

        if (!city)
            throw new Drash.Errors.HttpError(301, "city not stated");

        if (!temperature)
            throw new Drash.Errors.HttpError(301, "temperature not stated");

        await this.client.set(city, JSON.stringify({unit, temperature}));

        return response.json({message: 'weather set'});
    }
}