import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  time: string;
}

export const api = {
  async createEvent(event: Omit<Event, "id">): Promise<Event> {
    const response = await axios.post(`${API_BASE_URL}/events`, {
      ...event,
      
    });
    return response.data;
  },


  async updateEvent(
    id: string,
    event: Partial<Omit<Event, "id">>
  ): Promise<Event> {
    const response = await axios.patch(`${API_BASE_URL}/events/${id}`, event);
    return response.data;
  },

  async deleteEvent(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/events/${id}`);
  },

  async getEventCountForMonth(
    month: number,
    year: number
  ): Promise<{
    [date: string]: number;
  }> {
    const response = await axios.get(
      `${API_BASE_URL}/events/count/${month}/${year}`
    );
    return response.data;
  },

  async getAllEventForDate(date: string): Promise<Event[]> {
    const response = await axios.get(`${API_BASE_URL}/events/date/${date}`);
    return response.data;
  },

  async createTask(task: Omit<Task, "id">): Promise<Task> {
    const response = await axios.post(`${API_BASE_URL}/tasks`, task);
    return response.data;
  },

  async getAllTaskForDate(date: string): Promise<Task[]> {
    const response = await axios.get(`${API_BASE_URL}/tasks/date/${date}`);
    return response.data;
  },

  async updateTask(
    id: string,
    task: Partial<Omit<Task, "id">>
  ): Promise<Event> {
    const response = await axios.patch(`${API_BASE_URL}/tasks/${id}`, task);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/tasks/${id}`);
  },

};
