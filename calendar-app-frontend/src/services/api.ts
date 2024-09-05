import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export const api = {
  async createEvent(event: Omit<Event, 'id'>): Promise<Event> {
    const response = await axios.post(`${API_BASE_URL}/events`, event);
    return response.data;
  },

  async getAllEvents(): Promise<Event[]> {
    const response = await axios.get(`${API_BASE_URL}/events`);
    return response.data;
  },

  async updateEvent(id: string, event: Partial<Omit<Event, 'id'>>): Promise<Event> {
    const response = await axios.put(`${API_BASE_URL}/events/${id}`, event);
    return response.data;
  },

  async deleteEvent(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/events/${id}`);
  },
};