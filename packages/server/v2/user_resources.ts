import { AuthService } from "../services/auth_service.ts";
import { CurrentWeatherResource, FutureWeatherResource } from "../v1/user_resources.ts";

export class CurrentWeatherResourceWithAuth extends CurrentWeatherResource {
    public paths = this.prefixPaths("api_v2", ["/current"]);

    public services = {
        GET: [new AuthService()],
    }
}

export class FutureWeatherResourceWithAuth extends FutureWeatherResource {
    public paths = this.prefixPaths("api_v2", ["/forecast"]);

    public services = {
        GET: [new AuthService()],
    }
}