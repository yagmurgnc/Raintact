"use client";

import { useState, useEffect } from "react";
import ContactTable from "./contacts/components/ContactsTable";

import ContactsHeader from "./contacts/components/ContactsHeader";
import ContactsSearchBar from "./contacts/components/ContactsSearchBar";
import { Contact } from "./data/contacts";
import { ContactsGroupTabs } from "./contacts/components/ContactsGroupTabs";
import { supabase } from "@/lib/supabase";
import ContactDetailSheet from "./contacts/components/ContactDetailSheet";

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [groups, setGroups] = useState([
    { id: "all", label: "Tümü" },
    { id: "family", label: "Aile" },
    { id: "friends", label: "Arkadaşlar" },
    { id: "colleagues", label: "İş Arkadaşları" },
    { id: "clients", label: "Müşteriler" },
    { id: "relatives", label: "Akrabalar" }
  ]);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch contacts from Supabase
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Map database fields to our Contact interface
        // Database has avatar_url, App expects avatarUrl
        const mappedContacts: Contact[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          status: item.status,
          avatarUrl: item.avatar_url,
          initials: item.name ? item.name.substring(0, 2).toUpperCase() : "??"
        }));
        setContacts(mappedContacts);
      }
    } catch (error: any) {
      console.error("Error fetching contacts:", JSON.stringify(error, null, 2));
      alert("Veriler çekilemedi: " + (error.message || "Bilinmeyen hata"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleUpdateContact = async (updatedContact: Contact) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({
          name: updatedContact.name,
          email: updatedContact.email,
          phone: updatedContact.phone,
          status: updatedContact.status,
          avatar_url: updatedContact.avatarUrl
        })
        .eq('id', updatedContact.id);

      if (error) throw error;

      // Optimistic update
      setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const handleAddContact = async (newContact: Contact) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          name: newContact.name,
          email: newContact.email,
          phone: newContact.phone,
          status: newContact.status,
          avatar_url: newContact.avatarUrl
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const addedContact: Contact = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: data.status,
          avatarUrl: data.avatar_url,
          initials: data.name ? data.name.substring(0, 2).toUpperCase() : "??"
        };
        setContacts([addedContact, ...contacts]);
      }
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    // Archive (Soft Delete)
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status: 'Archived' })
        .eq('id', contactId);

      if (error) throw error;

      setContacts(contacts.map(c => c.id === contactId ? { ...c, status: "Archived" } : c));
    } catch (error) {
      console.error("Error archiving contact:", error);
    }
  };


  const handleUnarchiveContact = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status: 'Aile' }) // Defaulting to Aile as per previous logic
        .eq('id', contactId);

      if (error) throw error;

      setContacts(contacts.map(c => c.id === contactId ? { ...c, status: "Aile" } : c));
    } catch (error) {
      console.error("Error unarchiving contact:", error);
    }
  };

  const handleAddGroup = (groupName: string) => {
    const newId = groupName.toLowerCase().replace(/\s+/g, '-');
    setGroups([...groups, { id: newId, label: groupName }]);
    setActiveTab(newId);
  };

  const handlePermanentDeleteContact = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;

      setContacts(contacts.filter(c => c.id !== contactId));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  // Filter contacts based on search term AND active group (role/tag logic)
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm);

    // Match active tab to role (This is a simplification, ideally tags/groups would be a separate field ID)
    // The user prompt implies: "tap bölümündeki aile arkadaşlar gibi bölümler var bunu aşağıdaki kişiler kısmındaki statüdeki aileyse ailedeki kişiyi göstermelisin"
    // So we match the active tab's label to the contact's role/status? 
    // Let's assume the 'role' field in Contact matches the group Label or ID.
    // Existing data has roles like "Aile", "Arkadaşlar".
    // Our groups have labels "Aile", "Arkadaşlar".
    // So checks if contact.role === activeGroup.label

    const currentGroup = groups.find(g => g.id === activeTab);

    // Logic: if activeTab is 'all', show all groups
    const matchesGroup = activeTab === "all" ? true : (currentGroup ? contact.status === currentGroup.label : true);

    // Also filter out Archived if we are not in an Archive tab? 
    // The user said "move to archive". Is there an archive tab? Not in the list.
    // Maybe we shouldn't show Archived contacts in normal tabs?
    const isNotArchived = contact.status !== "Archived";

    return matchesSearch && matchesGroup && isNotArchived;
  });

  const archivedContacts = contacts.filter(c => c.status === "Archived");

  return (
    <div className="flex items-center justify-center font-sans  dark:bg-black">
      <main className="flex w-full flex-col items-center justify-start gap-24 py-10 px-20 dark:bg-black sm:items-start ">
        <ContactsHeader
          onAddContact={handleAddContact}
          archivedContacts={archivedContacts}
          onUnarchive={handleUnarchiveContact}
          onPermanentDelete={handlePermanentDeleteContact}
          groups={groups}
        />
        <ContactsSearchBar value={searchTerm} onChange={setSearchTerm} />
        <ContactsGroupTabs
          groups={groups}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAddGroup={handleAddGroup}
        />
        <ContactTable
          contacts={filteredContacts}
          onUpdateContact={handleUpdateContact}
          onDeleteContact={handleDeleteContact}
          onRowClick={setSelectedContact}
          groups={groups}
          onAddGroup={handleAddGroup}
          loading={loading}
        />

        <ContactDetailSheet
          contact={selectedContact}
          open={!!selectedContact}
          onOpenChange={(open) => !open && setSelectedContact(null)}
        />

      </main>
    </div>
  );
}
