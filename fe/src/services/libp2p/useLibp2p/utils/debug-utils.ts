import { loggerGate, shortenPeerId } from "@icod2/protocols";
import type { GossipSub } from "@libp2p/gossipsub";
import type { Libp2p } from "@libp2p/interface";

export const addDebugDiscoveryState = (
  libp2p: Libp2p<{ pubsub: GossipSub }>,
  roomToken: string,
) => {
  // @ts-expect-error
  window.debugDiscoveryState = () => {
    const topics = libp2p.services.pubsub.getTopics();
    const subs = libp2p.services.pubsub
      .getSubscribers(roomToken)
      .map((p) => p.toString());

    console.log("pubsub topics:", topics);
    console.log("discovery subscribers for room:", subs);
  };
};

export const addDebugLogDiscoveryMessages = (
  libp2p: Libp2p<{ pubsub: GossipSub }>,
  roomToken: string,
) => {
  console.log("addDebugLogDiscoveryMessages()");
  // @ts-expect-error
  window.debugLogDiscoveryMessages = () => {
    libp2p.services.pubsub.addEventListener("gossipsub:message", (evt) => {
      const msg = evt.detail.msg;
      if (msg.topic !== roomToken) return;
      console.log(
        "[DISCOVERY?] pubsub message on roomToken",
        msg.topic,
        "from",
        msg.type === "signed" ? shortenPeerId(msg.from.toString()) : "unknown",
        "bytes",
        msg.data?.length,
      );
    });
  };
};

export const addDebugPrintConnections = (libp2p: Libp2p) => {
  // @ts-expect-error
  window.debugPrintConnections = () => {
    const peers = libp2p.getPeers();
    loggerGate.canLog && console.log("Peers:", peers);
    const connections = libp2p.getConnections();
    const connectionAddrsStats = connections.reduce(
      (acc, connection) => {
        const { remotePeer } = connection;
        const peerIdStr = remotePeer.toString();
        const peerObj = acc[peerIdStr] || [];
        acc[peerIdStr] = peerObj;

        peerObj.push({
          multiPlexer: connection.multiplexer ?? "unknown",
          multiaddr: connection.remoteAddr.toString(),
          status: connection.status,
          streamsCount: connection.streams.length,
        });

        return acc;
      },
      {} as Record<
        string,
        {
          multiPlexer: string;
          multiaddr: string;
          status: string;
          streamsCount: number;
        }[]
      >,
    );
    loggerGate.canLog && console.log("Connections:", connectionAddrsStats);
  };
};

export const addDebugTriggerRediscovery = (
  libp2p: Libp2p<{ pubsub: GossipSub }>,
  roomToken: string,
) => {
  // @ts-expect-error
  window.debugTriggerRediscovery = async () => {
    // Temporarily unsubscribe and resubscribe
    libp2p.services.pubsub.unsubscribe(roomToken);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    libp2p.services.pubsub.subscribe(roomToken);
  };
};

export const addDebugPeerStore = (libp2p: Libp2p) => {
  // @ts-expect-error
  window.debugPrintPeerStore = async () => {
    const peers = await libp2p.peerStore.all();
    loggerGate.canLog && console.log("Peers:", peers);
  };
};

export const addManuallyBroadcastMessage = (
  libp2p: Libp2p<{ pubsub: GossipSub }>,
  roomToken: string,
) => {
  // @ts-expect-error
  window.manuallyBroadcastMessage = async (message?: string) => {
    const enc = new TextEncoder();
    await libp2p.services.pubsub.publish(
      roomToken,
      enc.encode(message ?? "test pubsub"),
    );
  };
};

export const cleanDebugUtils = () => {
  /* @ts-expect-error */
  delete window.addDebugDiscoveryState;
  /* @ts-expect-error */
  delete window.addDebugLogDiscoveryMessages;
  /* @ts-expect-error */
  delete window.debugPrintConnections;
  /* @ts-expect-error */
  delete window.debugTriggerRediscovery;
  /* @ts-expect-error */
  delete window.debugPrintPeerStore;
  /* @ts-expect-error */
  delete window.addManuallyBroadcastMessage;
};
