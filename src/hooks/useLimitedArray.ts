import { useState } from "react";

/**
 * Creates a state array that only allows a certain number of items to be added to it.
 *
 * The array is sorted by most recent first. In other words, the most recent addition is at index 0.
 *
 * @param initialValue Initial state value
 * @param maxLength Maximum length of the array
 * @returns The array and functions to manipulate it
 */
export default function useLimitedArray<T>(
  initialValue: T[],
  maxLength: number
): {
  array: T[];
  addItem: (item: T) => void;
  removeItem: (item: T) => T | undefined;
  clear: () => void;
} {
  const [array, setArray] = useState(initialValue);

  /**
   * Adds an item to the head of the limited array.
   * If the array is already at max length, the oldest item is removed.
   *
   * @param item The item to add
   */
  const addItem = (item: T) => {
    const newItems =
      array.length >= maxLength ? [item, ...array.slice(1)] : [item, ...array];
    setArray(newItems);
  };

  /**
   * Removes an item from the limited array. If the item is not found, nothing is done.
   *
   * @param item The item to remove
   * @returns The removed item, or undefined if the item was not found
   */
  const removeItem = (item: T) => {
    let removed: T | undefined;
    const newItems = array.filter((i) => i !== item && (removed = i));
    setArray(newItems);
    return removed;
  };

  /**
   * Clears the array.
   */
  const clear = () => setArray([]);

  return { array, addItem, removeItem, clear };
}
