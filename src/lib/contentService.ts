
import { ContentData, defaultSubscriptions, SubscriptionContent } from './contentTypes';

const STORAGE_KEY = 'subscription_content';

export const contentService = {
  // Récupérer le contenu depuis le localStorage
  getContent(): ContentData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
    
    return {
      subscriptions: defaultSubscriptions,
      lastUpdated: new Date().toISOString()
    };
  },

  // Sauvegarder le contenu dans le localStorage
  saveContent(content: ContentData): void {
    try {
      content.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (error) {
      console.error('Error saving content:', error);
      throw new Error('Failed to save content');
    }
  },

  // Mettre à jour un abonnement spécifique
  updateSubscription(subscriptionId: string, updates: Partial<SubscriptionContent>): void {
    const content = this.getContent();
    const index = content.subscriptions.findIndex(sub => sub.id === subscriptionId);
    
    if (index !== -1) {
      content.subscriptions[index] = { ...content.subscriptions[index], ...updates };
      this.saveContent(content);
    }
  },

  // Ajouter un nouvel abonnement
  addSubscription(subscription: Omit<SubscriptionContent, 'id'>): void {
    const content = this.getContent();
    const newSubscription: SubscriptionContent = {
      ...subscription,
      id: Date.now().toString()
    };
    content.subscriptions.push(newSubscription);
    this.saveContent(content);
  },

  // Supprimer un abonnement
  deleteSubscription(subscriptionId: string): void {
    const content = this.getContent();
    content.subscriptions = content.subscriptions.filter(sub => sub.id !== subscriptionId);
    this.saveContent(content);
  },

  // Réinitialiser aux valeurs par défaut
  resetToDefaults(): void {
    const content: ContentData = {
      subscriptions: defaultSubscriptions,
      lastUpdated: new Date().toISOString()
    };
    this.saveContent(content);
  }
};
