const express = require("express");
const axios = require("axios");

const app = express();
const port = 4000; // Choose your desired port

app.get("/", (req, res) => {
  // Construct the authorization URL using your Square application's client_id
  const clientId = "sandbox-sq0idb-8fPfBDLZUEG9dVEg3ACWkw";
  const redirectUri = "http://127.0.0.1:5173/"; // Update with your server's domain and callback route
  const responseType = "code"; // Use 'code' for OAuth code flow
  const scope = "MERCHANT_PROFILE_READ PAYMENTS_WRITE"; // Adjust the scopes based on your requirements

  const authUrl = `https://connect.squareupsandbox.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

  // Redirect the user to the Square authorization URL
  res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {
  const authorizationCode = req.query.code;

  if (authorizationCode) {
    try {
      const clientId = "sandbox-sq0idb-8fPfBDLZUEG9dVEg3ACWkw";
      const clientSecret =
        "sandbox-sq0csb-dbOLW_l6R1PNWUeg1PzTp0xKPfL31QGUrYx44vT89vM";
      const redirectUri = "http://127.0.0.1:5173/"; // Update with your server's domain and callback route

      const tokenResponse = await axios.post(
        "https://connect.squareupsandbox.com/oauth2/token",
        {
          client_id: clientId,
          client_secret: clientSecret,
          code: authorizationCode,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }
      );

      const accessToken = tokenResponse.data.access_token;
      const refreshToken = tokenResponse.data.refresh_token;

      // Now you have the access token and refresh token
      // Store them securely for future API requests

      res.send("Your Account Linked with Square Successfully..!");
    } catch (error) {
      console.error(
        "Error exchanging authorization code for access token:",
        error
      );
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(400).send("Authorization code not found");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
