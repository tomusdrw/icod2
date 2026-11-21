import type { Libp2p } from "@libp2p/interface";
import { toString as u8ToString } from "uint8arrays";
import { loggerGate } from "./loggerGate.js";

export function registerProtoHandle(
  protocol: string,
  libp2p: Libp2p,
  onMessage: (message: string, peerIdStr: string) => void,
) {
  loggerGate.canLog &&
    console.log("Protocol registered.", `protocol: ${protocol}`);

  return libp2p.handle(protocol, async (stream, connection) => {
    for await (const buf of stream) {
      const message = u8ToString(buf.subarray());
      onMessage(message, connection.remotePeer.toString());
    }
  });
}
