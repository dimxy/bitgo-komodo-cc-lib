'use strict'

const Debug = require('debug')
const logdebug = Debug('net:nspv')
const logerror = Debug('net:nspv:error');
const varuint = require('varuint-bitcoin');
const bufferutils = require("../src/bufferutils");
const utils = require('../net/utils');
const ccutils = require('../cc/ccutils');

// calc komodo equiheader hash
function kmdHdrHash(hdr)
{
  let buffer = Buffer.allocUnsafe(4 + 
    hdr.prevHash.length + hdr.merkleRoot.length + hdr.hashFinalSaplingRoot.length + 
    4 + 4 + hdr.nonce.length + varuint.encodingLength(hdr.solution.length) + hdr.solution.length);

  let bufferWriter = new bufferutils.BufferWriter(buffer);

  bufferWriter.writeInt32(hdr.version);
  bufferWriter.writeSlice(hdr.prevHash);
  bufferWriter.writeSlice(hdr.merkleRoot);
  bufferWriter.writeSlice(hdr.hashFinalSaplingRoot);
  bufferWriter.writeUInt32(hdr.timestamp);
  bufferWriter.writeUInt32(hdr.bits);
  bufferWriter.writeSlice(hdr.nonce);
  bufferWriter.writeVarSlice(hdr.solution);

  return utils.sha256(utils.sha256(bufferWriter.buffer));
}
exports.kmdHdrHash = kmdHdrHash;

