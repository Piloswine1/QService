import { Drash, grpc } from "../deps.ts";
import { AuthService as AuthServiceType } from "../types/auth.d.ts"

export class AuthService extends Drash.Service {
    public async runBeforeResource(
        request: Drash.Request,
        response: Drash.Response,
    ): Promise<void> {
        const protoPath = new URL("../proto/auth.proto", import.meta.url);
        const protoFile = await Deno.readTextFile(protoPath);

        const client = grpc.getClient<AuthServiceType>({
            hostname: Deno.env.get("GRPC_HOSTNNAME") ?? "localhost",
            port: Number(Deno.env.get("GRPC_PORT") ?? 50051),
            root: protoFile,
            serviceName: "AuthService",
        });

        const name = request.headers.get('Own-Auth-UserName');
        if (!name)
            throw new Drash.Errors.HttpError(403, "Failed to authorize");

        const { authenticated } = await client.Auth({ name });

        if (!authenticated)
            throw new Drash.Errors.HttpError(403, "Wrong username");

        client.close();
        response.json({ message: 'Success' });
    }
}