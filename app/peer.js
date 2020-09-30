class Peers {
  constructor() {
    this.peersList = {};
  }

  addPeer(peer) {
    this.peersList[peer] = 1;
    console.log('peer.js -- addPeer --> ' + this.peersList);
  }

  setPeerList(rootPeersList) {
    this.peersList = rootPeersList;
    console.log('peer.js -- setPeerList --> ' + this.peersList);
  }
}

module.exports = Peers;
