import { shortenPeerId } from "@icod2/protocols";
import type { GossipSub } from "@libp2p/gossipsub";
import type { Libp2p } from "libp2p";
import type { Logger } from "src/logger.js";

export const debugPubSubMessages = (
  libp2p: Libp2p<{ pubsub: GossipSub }>,
  logger: Logger,
) => {
  libp2p.services.pubsub.addEventListener("message", (e) => {
    const msg = e.detail;
    logger.info(
      {
        from:
          msg.type === "signed"
            ? shortenPeerId(msg.from.toString())
            : undefined,
        topic: msg.topic,
        dataLength: msg.data?.length ?? 0,
      },
      "Pubsub message on roomToken (might be discovery or app msg)",
    );
  });
};
