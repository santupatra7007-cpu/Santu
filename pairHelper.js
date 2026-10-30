// Fast WhatsApp pairing-code helper.
// The old flow waited up to 22s for the "connected" event — which never fires for a
// number that is not paired yet — so every pairing was ~22s slow. We now wait only for
// the socket to be ready ("qr" event = handshake done) and request the code at once.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getPairingCode(manager, phone, custom = "NOLOVEUO", readyTimeoutMs = 9000) {
  let ready;
  const readyP = new Promise((res) => (ready = res));
  const onQr = (sid) => sid === phone && ready("qr");
  const onConn = (sid) => sid === phone && ready("connected");
  manager.on("qr", onQr);
  manager.on("connected", onConn);
  try {
    const wasLive = manager.sessions?.has?.(phone);
    const sock = await manager.start(phone);
    if (!sock) throw new Error("Socket creation failed");
    if (sock.authState?.creds?.registered) return { already: true };
    if (typeof sock.requestPairingCode !== "function") {
      throw new Error("Pairing not supported — socket version may be outdated");
    }
    // wait only until the socket is ready (usually 1–3s), never the full timeout
    await Promise.race([readyP, sleep(wasLive ? 400 : readyTimeoutMs)]);

    let lastErr;
    for (let i = 0; i < 3; i++) {
      try {
        const code = await sock.requestPairingCode(phone, custom);
        if (code) return { code };
      } catch (e) {
        lastErr = e;
        await sleep(900);
      }
    }
    throw lastErr || new Error("No pair code returned");
  } finally {
    manager.removeListener("qr", onQr);
    manager.removeListener("connected", onConn);
  }
}
