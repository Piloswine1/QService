import { Drash, parse } from "./deps.ts";
import { BaseResource } from "./resources/base_resource.ts";
import { CurrentWeatherResource, FutureWeatherResource } from "./v1/user_resources.ts";
import { FutureWeatherResourceWithAuth, CurrentWeatherResourceWithAuth } from "./v2/user_resources.ts";
import { RedisWeatherResource } from "./v3/user_resources.ts";

enum Args {
    noV1 = 'noV1',
    noV2 = 'noV2',
    noV3 = 'noV3',
}

const parsed = parse(Deno.args, {
    boolean: Object.values(Args),
});

const resources: Array<typeof BaseResource> = [];

if (!parsed[Args.noV1] && !Deno.env.get(Args.noV1))
    resources.push(
        ...[
            CurrentWeatherResource,
            FutureWeatherResource
        ]
    );

if (!parsed[Args.noV2] && !Deno.env.get(Args.noV2))
    resources.push(
        ...[
            CurrentWeatherResourceWithAuth,
            FutureWeatherResourceWithAuth
        ]
    );

if (!parsed[Args.noV3] && !Deno.env.get(Args.noV3))
    resources.push(RedisWeatherResource);

export const server = new Drash.Server({
    hostname: "0.0.0.0",
    port: Number(Deno.env.get("LISTEN_PORT") ?? 8888),
    protocol: "http",
    resources,
});

server.run();

console.log(`Server running at ${server.address}.`);