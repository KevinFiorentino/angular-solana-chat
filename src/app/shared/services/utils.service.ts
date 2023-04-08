import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  truncatedAddress(address: string): string {
    return `${address?.substring(0, 4)}...${address?.substring(address.length-4, address.length)}`;
  }

  sortMessages(data: any): any[] {
    const messages = data.sort((a: any, b: any) => {
      if (a.account.timestamp.toString() < b.account.timestamp.toString())
        return -1;
      if (a.account.timestamp.toString() > b.account.timestamp.toString())
        return 1;
      return 0;
    });
    return messages;
  }

}
