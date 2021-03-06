import { Drash } from "../deps.ts";

export class BaseResource extends Drash.Resource {
    #prefixes: { [k: string]: string } = {
        api_v1: "/v1",
        api_v2: "/v2",
        api_v3: "/v3",
    };

    protected prefixPaths(prefix: string, paths: string[]) {
        return paths.map((path) => this.#prefixes[prefix] + path);
    }
}