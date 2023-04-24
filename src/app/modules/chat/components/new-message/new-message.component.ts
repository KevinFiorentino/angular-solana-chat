import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatProgramService } from '@shared/services/solana-contracts/chat-program.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit {

  public formMessage!: UntypedFormGroup;
  public loading = false;

  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: UntypedFormBuilder,
    private chatProgram: ChatProgramService,
    private dialog: MatDialogRef<NewMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formMessage = this.formBuilder.group({
      text: ['', Validators.required],
    });
  }

  async sendMessage() {
    if (this.formMessage.valid) {
      this.loading = true;
      const text = this.formMessage.get('text')!.value;
      this.chatProgram.sendMessage(text)
        .then(txId => {
          this.loading = false;
          console.log(`Transaction ID: ${txId}`);
          this.alertTxOK(`Transaction ID: ${txId}`);
          this.data.callback();
          this.closeModal();
        })
        .catch(err => {
          this.loading = false;
          this.alertTxErr(err.message);
        });
    }
  }

  alertTxOK(msg: string): void {
    this.snackBar.open(msg, 'Close', {
      duration: 7000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['app-alert-success']
    });
  }

  alertTxErr(msg: string): void {
    this.snackBar.open(msg, 'Close', {
      duration: 7000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['app-alert-danger']
    });
  }

  closeModal(): void {
    this.dialog.close();
  }

}
