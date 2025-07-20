import contactsService from "../services/contactsServices.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);

    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await contactsService.removeContact(id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(deletedContact);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createContact = async (req, res) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { name, email, phone } = req.body;
    const newContact = await contactsService.addContact(name, email, phone);

    if (!newContact) {
      return res.status(500).json({ message: "Failed to create contact" });
    }

    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = updateContactSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const updatedContact = await contactsService.updateContact(id, req.body);

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
