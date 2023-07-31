const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    version: Number,
    createdTime: { type: Date, default: Date.now() },
    lastModifiedUser: String,
    lastModifiedTime: { type: Date, default: Date.now() },
    owner: String,
    isOwnerSigner: { type: Boolean, default: true },
    sequential: { type: Boolean, default: false },
    starred: { type: Boolean, default: false },
    signers:
      [
        {
          email: String,
          name: String,
          image: String,
          viewed:{type:Boolean, default:false},
          status: {
            type: String,
            enum: ['signed', 'waiting', 'rejected', 'expired'],
            default: 'waiting'
          },
          deadline: { type: Date, default: Date.now() },
          order: Number
        }
      ],
    status: {
      type: String,
      enum: ['uploaded','added_signers', 'sent'],
      default: 'uploaded'
    },
    comments:
      [
        {
          user:  {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
          },
          comment: String
        }
      ],
    buffer: { type: Buffer },
    timeline: [
      {
        action: {
          type: String,
          enum: ['signed', 'viewed', 'rejected', 'expired','created'],
        },
        time: { type: Date},
        email:String

      }
    ],
    lastModifiedHash : String
  }
);
const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
