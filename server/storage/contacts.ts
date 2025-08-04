import { eq } from "drizzle-orm";
import { db } from "../db";
import { contacts } from "@shared/schema";
import type { Contacts, InsertContacts } from "@shared/schema";
import crypto from "crypto";

export class ContactStorage {
  async getContacts(): Promise<Contacts[]> {
    return await db.select().from(contacts);
  }

  async getContact(id: string): Promise<Contacts | undefined> {
    const result = await db.select().from(contacts).where(eq(contacts.id, id));
    return result[0];
  }

  async createContact(contact: InsertContacts): Promise<Contacts> {
    const id = crypto.randomUUID();
    const contactWithId = { ...contact, id };
    const result = await db.insert(contacts).values(contactWithId).returning();
    return result[0];
  }

  async updateContact(id: string, contact: Partial<InsertContacts>): Promise<Contacts | undefined> {
    const result = await db.update(contacts).set(contact).where(eq(contacts.id, id)).returning();
    return result[0];
  }

  async deleteContact(id: string): Promise<boolean> {
    const result = await db.delete(contacts).where(eq(contacts.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
