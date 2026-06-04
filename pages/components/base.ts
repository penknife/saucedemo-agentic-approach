import { Locator } from '@playwright/test';

/**
 * Abstract base for all Page Components.
 * Components receive an already-scoped root Locator so they can be
 * embedded in any page that renders the same DOM subtree.
 */
export abstract class BaseComponent {
  constructor(protected readonly root: Locator) {}
}
