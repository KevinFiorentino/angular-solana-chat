import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PhantomConnectService } from '@shared/services/phantom-connect.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-message',
  templateUrl: './update-message.component.html',
  styleUrls: ['./update-message.component.scss']
})
export class UpdateMessageComponent implements OnInit {

  public formMessage!: FormGroup;
  public loading = false;

  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private phantom: PhantomConnectService,
    private dialog: MatDialogRef<UpdateMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formMessage = this.formBuilder.group({
      text: ['', Validators.required],
    });
    this.matchForm();
  }

  matchForm(): void {
    this.formMessage.patchValue(this.data.msg.account);
  }

  updateMessage(): void {
    if (this.formMessage.valid) {
      this.loading = true;
      const text = this.formMessage.get('text')!.value;
      this.phantom.updateMessage(text, this.data.msg.publicKey)
        .then(txId => {
          console.log(`Transaction ID: ${txId}`);
          this.alertTxOK(`Transaction ID: ${txId}`);
          this.data.callback();
          this.closeModal();
          this.loading = false;
        })
        .catch(err => {
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
