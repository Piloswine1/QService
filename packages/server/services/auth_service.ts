import { Drash, grpc } from "../deps.ts";
import { AuthService as AuthServiceType } from "../types/auth.d.ts"

export class AuthService extends Drash.Service {
    public async runBeforeResource(
        request: Drash.Request,
        response: Drash.Response,
    ): Promise<void> {
        try {
            const protoPath = new URL("../../../proto/auth.proto", import.meta.url);
            const protoFile = await Deno.readTextFile(protoPath);
            
            const client = grpc.getClient<AuthServiceType>({
                hostname: Deno.env.get("GRPC_HOSTNNAME") ?? "localhost",
                port: Number(Deno.env.get("GRPC_PORT") ?? 50051),
                root: protoFile,
                serviceName: "AuthService",
            });

            const name = request.headers.get('Own-Auth-UserName');
            if (!name)
                return response.json({ message: "Failed to authorize" }, 403);

            const {authenticated} = await client.Auth({name});

            if (!authenticated)
                return response.json({ message: "Wrong username" }, 403);
            
            client.close();
            response.json({message: 'Success'});
        } catch (error) {
            console.error(error)
            response.json({ message: "Failed to authorize" }, 403);
        }
    }
}