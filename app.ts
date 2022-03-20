import { Drash } from "./deps.ts";
import { CurrentWeatherResource, FutureWeatherResource } from "./v1/user_resources.ts";

export const server = new Drash.Server({
    hostname: "0.0.0.0",
    port: Number(Deno.env.get("LISTEN_PORT") ?? 8888),
    protocol: "http",
    resources: [CurrentWeatherResource, FutureWeatherResource],
});

server.run();

console.log(`Server running at ${server.address}.`);