'use client'

import React, { useState, useEffect } from 'react';
import Calendar from '@/components/ui/Calendar';
import EventForm from '@/components/ui/EventForm';
import SearchBar from '@/components/ui/SearchBar';
import { api, Event } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await api.getAllEvents();
      setEvents(fetchedEvents);
      setFilteredEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleCreateEvent = async (eventData: Omit<Event, 'id'>) => {
    try {
      await api.createEvent(eventData);
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleUpdateEvent = async (id: string, eventData: Partial<Omit<Event, 'id'>>) => {
    try {
      await api.updateEvent(id, eventData);
      fetchEvents();
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await api.deleteEvent(id);
      fetchEvents();
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleSearch = (query: string) => {
    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Calendar App</h1>
      <div className="mb-4 flex justify-between items-center">
        <SearchBar onSearch={handleSearch} />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <EventForm onSubmit={handleCreateEvent} />
          </DialogContent>
        </Dialog>
      </div>
      <Calendar events={filteredEvents} onEventClick={setSelectedEvent} />
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            <EventForm
              initialData={selectedEvent}
              onSubmit={(data) => handleUpdateEvent(selectedEvent.id, data)}
            />
            <Button variant="destructive" onClick={() => handleDeleteEvent(selectedEvent.id)}>
              Delete Event
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}