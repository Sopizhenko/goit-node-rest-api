import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, "..", "db", "contacts.json");

// Функція для отримання всіх контактів
async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Функція для отримання контакту за id
async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    return contacts.find((contact) => contact.id === contactId) || null;
  } catch (error) {
    return null;
  }
}

// Функція для видалення контакту
async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const contactToRemove = contacts.find(
      (contact) => contact.id === contactId
    );

    if (!contactToRemove) {
      return null;
    }

    const filteredContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );
    await fs.writeFile(contactsPath, JSON.stringify(filteredContacts, null, 2));

    return contactToRemove;
  } catch (error) {
    return null;
  }
}

// Функція для додавання контакту
async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      phone,
    };

    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return newContact;
  } catch (error) {
    return null;
  }
}

// Функція для оновлення контакту
async function updateContact(contactId, updateData) {
  try {
    const contacts = await listContacts();
    const contactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );

    if (contactIndex === -1) {
      return null;
    }

    // Оновлюємо тільки передані поля
    contacts[contactIndex] = {
      ...contacts[contactIndex],
      ...updateData,
    };

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return contacts[contactIndex];
  } catch (error) {
    return null;
  }
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
