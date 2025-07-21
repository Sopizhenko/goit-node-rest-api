import Contact from "../models/Contact.js";

// Функція для отримання всіх контактів
async function listContacts() {
  try {
    const contacts = await Contact.findAll();
    return contacts;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
}

// Функція для отримання контакту за id
async function getContactById(contactId) {
  try {
    const contact = await Contact.findByPk(contactId);
    return contact;
  } catch (error) {
    console.error("Error fetching contact by id:", error);
    return null;
  }
}

// Функція для видалення контакту
async function removeContact(contactId) {
  try {
    const contact = await Contact.findByPk(contactId);
    if (!contact) {
      return null;
    }

    await contact.destroy();
    return contact;
  } catch (error) {
    console.error("Error removing contact:", error);
    return null;
  }
}

// Функція для додавання контакту
async function addContact(name, email, phone, favorite = false) {
  try {
    const newContact = await Contact.create({
      name,
      email,
      phone,
      favorite,
    });
    return newContact;
  } catch (error) {
    console.error("Error creating contact:", error);
    return null;
  }
}

// Функція для оновлення контакту
async function updateContact(contactId, updateData) {
  try {
    const contact = await Contact.findByPk(contactId);
    if (!contact) {
      return null;
    }

    await contact.update(updateData);
    return contact;
  } catch (error) {
    console.error("Error updating contact:", error);
    return null;
  }
}

// Функція для оновлення статусу контакту
async function updateStatusContact(contactId, updateData) {
  try {
    const contact = await Contact.findByPk(contactId);
    if (!contact) {
      return null;
    }

    // Оновлюємо тільки поле favorite
    await contact.update({ favorite: updateData.favorite });
    return contact;
  } catch (error) {
    console.error("Error updating contact status:", error);
    return null;
  }
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
