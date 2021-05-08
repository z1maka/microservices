import * as mongoose from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@z1maka-common/common";

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, returnedValue) {
        returnedValue.id = returnedValue._id;
        delete returnedValue._id;
      },
    },
  }
);

TicketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

// @ts-ignore
TicketSchema.methods.isReserved = async function (
  this: TicketDoc
): Promise<boolean> {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder;
};

export const Ticket = mongoose.model<TicketDoc, TicketModel>(
  "Ticket",
  TicketSchema
);
