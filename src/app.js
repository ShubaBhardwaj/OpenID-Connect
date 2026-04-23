import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/.well-known/openid-configuration', (req, res) => {
    return res.status(200).json({
        "issuer": "http://localhost:3000",
        "authorization_endpoint": "http://localhost:3000/api/auth/register",
        "token_endpoint": "http://localhost:3000/api/auth/login",
        "userinfo_endpoint": "http://localhost:3000/api/auth/me",
        "jwks_uri": "http://localhost:3000/.well-known/jwks.json",
        "response_types_supported": ["code", "token", "id_token"],
        "subject_types_supported": ["public"],
        "id_token_signing_alg_values_supported": ["HS256"],
        "scopes_supported": ["openid", "profile", "email"],
        "token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post"],
        "claims_supported": ["sub", "name", "email", "iat", "exp", "aud", "iss"]
    })
})

app.use('/.well-known/jwks.json', (req, res) => {
    const key = await jose.JWK.asKey(PUBLIC_KEY, "pem");
    return res.json({ keys: [key.toJSON()] });
})

app.use('/api/auth', authRoutes)

export default app;