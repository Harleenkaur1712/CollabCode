import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IRoom
  extends Document {
  name: string;
  roomCode: string;
  owner: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];

  code: string;
  language: string;
}

const roomSchema =
  new Schema<IRoom>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      roomCode: {
        type: String,
        required: true,
        unique: true,
      },

      owner: {
        type:
          Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      participants: [
        {
          type:
            Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      code: {
        type: String,
        default: `// Welcome to CollabCode

function solve() {

}
`,
      },

      language: {
        type: String,
        default:
          "javascript",
      },
    },
    {
      timestamps: true,
    }
  );

const Room =
  mongoose.model<IRoom>(
    "Room",
    roomSchema
  );

export default Room;