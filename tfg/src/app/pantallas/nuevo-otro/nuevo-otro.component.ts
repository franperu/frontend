import { Component, OnInit, Inject } from '@angular/core';
import { OtrosRecuerdos } from 'src/app/core/clases/clases';
import { SnackService } from 'src/app/core/services/snack/snack.service';
import { OtroService } from 'src/app/core/services/otro/otro.service';
import { TokenService } from 'src/app/core/services/tokenService/token-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadService } from 'src/app/core/services/uploadService/upload.service';
import { InterfazOtrosService } from 'src/app/core/services/interfaz-otros/interfaz-otros.service';

@Component({
  selector: 'app-nuevo-otro',
  templateUrl: './nuevo-otro.component.html',
  styleUrls: ['./nuevo-otro.component.scss']
})
export class NuevoOtroComponent implements OnInit {

  otro: OtrosRecuerdos;
  otros: OtrosRecuerdos[] = [];
  otroGuardado: OtrosRecuerdos;
  idUser: number;
  idFamiliar: number;
  private archvioSeleccionado: File;

  constructor(public dialogoRef: MatDialogRef<NuevoOtroComponent>, @Inject(MAT_DIALOG_DATA) public data:number, public snackService: SnackService, private otroService: OtroService, private tokenService: TokenService, private uploadService: UploadService, private interfazOtros: InterfazOtrosService) { }

  ngOnInit(): void {
    this.otroGuardado = new OtrosRecuerdos();
    this.interfazOtros.stop();
    this.otro = new OtrosRecuerdos();
    if(this.data !== null){
      this.idUser = this.data;
      console.log(this.idUser);
    }
  }

  public onFileChanged(event) {
    this.archvioSeleccionado = event.target.files[0];
  }

  public onUpload(idUsuario: number, idRecuerdo: number) {
    //this.mascota.imagen1 = this.archvioSeleccionado.name;
    console.log(this.archvioSeleccionado);

    const uploadImageData = new FormData();
    uploadImageData.append('file', this.archvioSeleccionado, this.archvioSeleccionado.name)

    this.uploadService.uploadFile(uploadImageData, "otro", idUsuario, idRecuerdo ).subscribe(data => {
      console.log("subida archivo ok");
    },
      (error: any) => {
        console.log(error)
      }
    );

  }

  public validaciones(recuerdo: OtrosRecuerdos) {

    let save: boolean = true;

    if (recuerdo.tipo === undefined || recuerdo.tipo.trim().length === 0 || !/[a-zA-Z\u00C0-\u017F\s]+/.test(recuerdo.tipo)) {
      this.snackService.errorSnackbar('El tipo de recuerdo no debe estar vacío ni contener números');
      save = false;
    }
    else if (recuerdo.descripcion === undefined || recuerdo.descripcion === null || !/[a-zA-Z\u00C0-\u017F\s]+/.test(recuerdo.descripcion)) {
      this.snackService.errorSnackbar('La descripción del recuerdo no debe estar vacía');
      save = false;
    }

    console.log(save);
    return save;
  }

  public addRecuerdo(recuerdo: OtrosRecuerdos) {

    this.idUser = this.tokenService.getId();
    let idRecuerdo: number;

    let save = this.validaciones(recuerdo);
    if (save) {
      if (this.tokenService.getIdUsuario() === null || this.tokenService.getIdUsuario() === undefined || this.tokenService.getIdUsuario() === 0) {
        this.otroService.crearRecuerdo(recuerdo, this.idUser).subscribe(data => {
          console.log("guardado recuerdo ok");
          this.otroGuardado = data;
          idRecuerdo = this.otroGuardado.id;
          this.interfazOtros.addRecuerdo(this.otros[this.otros.length-1]);
          this.onUpload(this.idUser, idRecuerdo);
        },
          (error: any) => {
            console.log(error)
          }
        );
      }
      else {
        this.otroService.crearRecuerdo(recuerdo, this.tokenService.getIdUsuario()).subscribe(data => {
          console.log("guardado recuerdo ok");
          this.otroGuardado = data;
          idRecuerdo = this.otroGuardado.id;
          this.interfazOtros.addRecuerdo(this.otros[this.otros.length-1]);
          this.onUpload(this.idUser, idRecuerdo);
        },
          (error: any) => {
            console.log(error)
          }
        );
      }
      this.dialogoRef.close();
    }
  }

  public close() {
    this.dialogoRef.close();
    this.interfazOtros.back();
  }

}
