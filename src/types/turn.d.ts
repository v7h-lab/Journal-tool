// TypeScript declarations for Turn.js library

/// <reference types="jquery" />

declare namespace Turn {
  interface Options {
    width?: number;
    height?: number;
    autoCenter?: boolean;
    display?: 'double' | 'single';
    acceleration?: boolean;
    gradients?: boolean;
    elevation?: number;
    duration?: number;
    pages?: number;
    page?: number;
    when?: {
      turning?: (event: Event, page: number, view: string[]) => void;
      turned?: (event: Event, page: number, view: string[]) => void;
      start?: (event: Event, pageObject: any, corner: string) => void;
      end?: (event: Event, pageObject: any, turned: boolean) => void;
      missing?: (event: Event, pages: number[]) => void;
      first?: (event: Event) => void;
      last?: (event: Event) => void;
    };
  }

  interface API {
    // Navigation methods
    next(): JQuery;
    previous(): JQuery;
    page(page: number): JQuery;
    page(): number;
    
    // Display methods
    display(display: 'double' | 'single'): JQuery;
    display(): 'double' | 'single';
    
    // Zoom methods
    zoom(zoomLevel: number, x?: number, y?: number, duration?: number): JQuery;
    zoom(): number;
    
    // Size methods
    size(width: number, height: number): JQuery;
    
    // Utility methods
    destroy(): JQuery;
    is(): boolean;
    resize(): JQuery;
    center(page?: number): JQuery;
    
    // Page methods
    addPage(element: HTMLElement | JQuery, pageNumber?: number): JQuery;
    removePage(pageNumber: number): JQuery;
    hasPage(pageNumber: number): boolean;
    
    // State methods
    disable(value: boolean): JQuery;
    disabled(): boolean;
    
    // Animation methods
    stop(ignore?: boolean, animate?: boolean): JQuery;
    playing(): boolean;
    animating(): boolean;
    
    // Range methods
    range(): number[];
    range(range: number[]): JQuery;
  }
}

interface JQuery {
  turn(options?: Turn.Options): JQuery;
  turn(method: 'next'): JQuery;
  turn(method: 'previous'): JQuery;
  turn(method: 'page', page: number): JQuery;
  turn(method: 'page'): number;
  turn(method: 'display', display: 'double' | 'single'): JQuery;
  turn(method: 'display'): 'double' | 'single';
  turn(method: 'zoom', zoomLevel: number, x?: number, y?: number, duration?: number): JQuery;
  turn(method: 'zoom'): number;
  turn(method: 'size', width: number, height: number): JQuery;
  turn(method: 'destroy'): JQuery;
  turn(method: 'is'): boolean;
  turn(method: 'resize'): JQuery;
  turn(method: 'center', page?: number): JQuery;
  turn(method: 'addPage', element: HTMLElement | JQuery, pageNumber?: number): JQuery;
  turn(method: 'removePage', pageNumber: number): JQuery;
  turn(method: 'hasPage', pageNumber: number): boolean;
  turn(method: 'disable', value: boolean): JQuery;
  turn(method: 'disabled'): boolean;
  turn(method: 'stop', ignore?: boolean, animate?: boolean): JQuery;
  turn(method: 'playing'): boolean;
  turn(method: 'animating'): boolean;
  turn(method: 'range'): number[];
  turn(method: 'range', range: number[]): JQuery;
  turn(method: string, ...args: any[]): any;
}

export {};
