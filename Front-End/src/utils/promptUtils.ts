/**
 * Prompt Utilities
 * 
 * This module provides utilities for loading and managing LLM prompts
 */

/**
 * Load a prompt from the prompts directory
 * 
 * @param promptName - Name of the prompt file (without extension)
 * @returns Promise resolving to the prompt text
 */
export const loadPrompt = async (promptName: string): Promise<string> => {
  try {
    const response = await fetch(`/prompts/${promptName}.txt`);
    if (!response.ok) {
      throw new Error(`Failed to load prompt: ${response.status} ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error loading prompt ${promptName}:`, error);
    return '';
  }
};

/**
 * Format a prompt with variables
 * 
 * @param promptTemplate - Template string with {variable} placeholders
 * @param variables - Object with variable values
 * @returns Formatted prompt
 */
export const formatPrompt = (promptTemplate: string, variables: Record<string, any>): string => {
  let formattedPrompt = promptTemplate;
  
  // Replace each variable in the template
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    formattedPrompt = formattedPrompt.replace(regex, String(value || ''));
  });
  
  return formattedPrompt;
};

/**
 * Get a list of all available prompts
 * 
 * @returns Promise resolving to an array of prompt names
 */
export const listAvailablePrompts = async (): Promise<string[]> => {
  try {
    // This is a simplified implementation
    // In a real application, you might need a server endpoint to list files
    return [
      'check-consistency',
      'find-analogies',
      'generate-concept-summary',
      'generate-protocol-outline',
      'launch-exploratory-analysis',
      'suggest-compatible-components'
    ];
  } catch (error) {
    console.error('Error listing available prompts:', error);
    return [];
  }
};

/**
 * Create a new prompt file
 * 
 * @param promptName - Name of the prompt
 * @param promptContent - Content of the prompt
 * @returns Promise resolving to success status
 */
export const createPrompt = async (promptName: string, promptContent: string): Promise<boolean> => {
  try {
    // This would require a server endpoint in a real application
    // For now, we'll just simulate success
    console.log(`Creating prompt ${promptName} (simulated)`);
    return true;
  } catch (error) {
    console.error(`Error creating prompt ${promptName}:`, error);
    return false;
  }
};

/**
 * Update an existing prompt file
 * 
 * @param promptName - Name of the prompt
 * @param promptContent - New content of the prompt
 * @returns Promise resolving to success status
 */
export const updatePrompt = async (promptName: string, promptContent: string): Promise<boolean> => {
  try {
    // This would require a server endpoint in a real application
    // For now, we'll just simulate success
    console.log(`Updating prompt ${promptName} (simulated)`);
    return true;
  } catch (error) {
    console.error(`Error updating prompt ${promptName}:`, error);
    return false;
  }
};

/**
 * Delete a prompt file
 * 
 * @param promptName - Name of the prompt to delete
 * @returns Promise resolving to success status
 */
export const deletePrompt = async (promptName: string): Promise<boolean> => {
  try {
    // This would require a server endpoint in a real application
    // For now, we'll just simulate success
    console.log(`Deleting prompt ${promptName} (simulated)`);
    return true;
  } catch (error) {
    console.error(`Error deleting prompt ${promptName}:`, error);
    return false;
  }
};