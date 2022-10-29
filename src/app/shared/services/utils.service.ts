import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() {}

  truncatedAddress(address: string): string {
    return `${address?.substring(0, 4)}...${address?.substring(address.length-4, address.length)}`;
  }

}
