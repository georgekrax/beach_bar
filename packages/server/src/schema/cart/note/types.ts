import { resolve } from "@/utils/data";
import { objectType } from "nexus";
import { CartNote } from "nexus-prisma";

export const CartNoteType = objectType({
  name: CartNote.$name,
  description: "Represents a note of the user, added in its shopping cart, for the #beach_bar(s), it is going to visit",
  definition(t) {
    // t.id("id");
    // t.string("body", { description: "The body text content of the note" });
    // t.field("cart", { type: CartType, description: "The shopping cart the note is added" });
    // t.field("beachBar", { type: BeachBarType, description: "The #beach_bar that the note refers to" });
    // t.field("timestamp", { type: DateTime.name });
    t.field(CartNote.id);
    t.field(CartNote.body);
    t.field(resolve(CartNote.cart));
    t.field(resolve(CartNote.beachBar));
    t.field(CartNote.timestamp);
  },
});
