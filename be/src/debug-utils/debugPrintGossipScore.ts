import { shortenPeerId } from "@icod2/protocols";
import type { Libp2p } from "@libp2p/interface";
import type { Logger } from "src/logger.js";

export const debugPrintGossipScore = (libp2p: Libp2p, logger: Logger) => {
  const gs = libp2p.services.pubsub as unknown as {
    peers: Map<string, unknown>;
    score: { score: (id: string) => number };
    mesh: Map<string, Set<string>>;
  };

  const scores = Array.from(gs.peers.keys()).map((id: string) => ({
    id: shortenPeerId(id),
    score: gs.score.score(id),
  }));

  const mesh = Array.from(gs.mesh.entries()).map(
    ([topic, peers]: [string, Set<string>]) => ({
      topic,
      peers: Array.from(peers).map((p) => shortenPeerId(p)),
    }),
  );

  logger.info({ scores, mesh }, "Gossipsub scores/mesh snapshot");
};
