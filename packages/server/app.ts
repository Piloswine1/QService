import { Drash, DexterService } from "./deps.ts";
// import { BaseResource } from "./resources/base_resource.ts";
import { CurrentWeatherResource, FutureWeatherResource } from "./v1/user_resources.ts";
import { FutureWeatherResourceWithAuth, CurrentWeatherResourceWithAuth } from "./v2/user_resources.ts";
import { RedisWeatherResource } from "./v3/user_resources.ts";

const dexter = new DexterService({
    url: true,
    method: true,
    enabled: true,
    response_time: true,
});

export const server = new Drash.Server({
    hostname: "0.0.0.0",
    port: Number(Deno.env.get("LISTEN_PORT") ?? 8888),
    protocol: "http",
    resources: [
        CurrentWeatherResource,
        FutureWeatherResource,
        CurrentWeatherResourceWithAuth,
        FutureWeatherResourceWithAuth,
        RedisWeatherResource
    ],
    services: [ dexter ],
});

server.run();

console.log(`Server running at ${server.address}.`);