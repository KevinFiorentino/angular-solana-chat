import { Injectable } from '@angular/core';
import { PublicKey } from '@solana/web3.js';
import { PhantomConnectService } from './phantom/phantom-connect.service';
import { IDL, SolanaChat } from '@shared/idls/solana-chat.idl';
import { web3, Program, ProgramAccount, getProvider, IdlTypes } from '@project-serum/anchor';

@Injectable({
  providedIn: 'root'
})
export class ChatProgramService {

  private programID = new PublicKey(IDL.metadata.address);

  constructor(
    private phantom: PhantomConnectService
  ) {}


  /* ********** CONTRACT CONNECTION ********** */

  getAllMessages(): Promise<ProgramAccount<IdlTypes<SolanaChat>>[]> {
    const provider = getProvider();
    const program = new Program(IDL, this.programID, provider);
    return program.account.message.all();
  }

  getMessagesByWalletAddress(walletAddress: string): Promise<ProgramAccount<IdlTypes<SolanaChat>>[]> {
    const provider = getProvider();
    const program = new Program(IDL, this.programID, provider);
    return program.account.message.all([{
      memcmp: {
        offset: 8,
        bytes: walletAddress
      }
    }]);
  }

  async sendMessage(message: string): Promise<string> {     // Return Transaction ID
    const { SystemProgram, Keypair } = web3;

    const provider = getProvider();
    const program = new Program(IDL, this.programID, provider);
    const kp = Keypair.generate();

    const t = await program.methods
      .createMessage(message)
      .accounts({
        message: kp.publicKey,
        user: provider.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([kp])
      .transaction();

    return this.phantom.signAndSendTransactionWeb(t, kp);
  }

  async updateMessage(message: string, accountPublicKey: PublicKey): Promise<string> {
    const provider = getProvider();
    const program = new Program(IDL, this.programID, provider);

    const i = await program.methods
      .updateMessage(message)
      .accounts({
        message: accountPublicKey,
        user: provider.publicKey,
      })
      .transaction();

    return this.phantom.signAndSendTransactionWeb(i);
  }

  async deleteMessage(accountPublicKey: PublicKey): Promise<string> {
    const provider = getProvider();
    const program = new Program(IDL, this.programID, provider);

    const i = await program.methods
      .deleteMessage()
      .accounts({
        message: accountPublicKey,
        user: provider.publicKey,
      })
      .transaction();

    return this.phantom.signAndSendTransactionWeb(i);
  }

}
