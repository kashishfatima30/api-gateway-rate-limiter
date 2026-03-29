const selfsigned = require("selfsigned");
const fs = require("fs");

async function generate() {
  const attrs = [{ name: "commonName", value: "localhost" }];

  // ✅ await here
  const pems = await selfsigned.generate(attrs, {
    days: 365,
    keySize: 2048,
  });

  console.log(pems); // optional debug

  const privateKey = pems.privateKey || pems.private;
  const cert = pems.cert;

  if (!privateKey || !cert) {
    throw new Error("Certificate generation failed");
  }

  fs.writeFileSync("server.key", privateKey);
  fs.writeFileSync("server.cert", cert);

  console.log("✅ SSL certificates generated!");
}

generate();