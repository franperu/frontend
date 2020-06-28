import { Component, OnInit, Inject } from '@angular/core';
import { Mascota } from 'src/app/core/clases/clases';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackService } from 'src/app/core/services/snack/snack.service';
import { MascotaService } from 'src/app/core/services/mascota/mascota.service';
import { TokenService } from 'src/app/core/services/tokenService/token-service.service';
import { UploadService } from 'src/app/core/services/uploadService/upload.service';
import { InterfazService } from 'src/app/core/services/interfaz.service';

@Component({
  selector: 'app-nueva-mascota',
  templateUrl: './nueva-mascota.component.html',
  styleUrls: ['./nueva-mascota.component.scss']
})
export class NuevaMascotaComponent implements OnInit {

  mascota: Mascota;
  mascotas: Mascota[] = [];
  idUser: Number;
  private archvioSeleccionado: File;

  constructor(public dialogoRef: MatDialogRef<NuevaMascotaComponent>, @Inject(MAT_DIALOG_DATA) public data:Number, public snackService: SnackService, private mascotaService: MascotaService, private tokenService: TokenService, private uploadService: UploadService, private interfazService: InterfazService) { }

  ngOnInit(): void {
    this.mascota = new Mascota();
    if(this.data !== null){
      this.idUser = this.data;
      console.log(this.idUser);
    }
  }

  public onFileChanged(event) {
    this.archvioSeleccionado = event.target.files[0];
  }

  public onUpload() {
    this.mascota.imagen1 = this.archvioSeleccionado.name;
    console.log(this.archvioSeleccionado);

    const uploadImageData = new FormData();
    uploadImageData.append('file', this.archvioSeleccionado, this.archvioSeleccionado.name)

    this.uploadService.uploadFile(uploadImageData).subscribe(data => {
      console.log("subida archivo ok");
    },
      (error: any) => {
        console.log(error)
      }
    );

  }

  public validaciones(mascota: Mascota) {

    let save: boolean = true;

    if (mascota.nombre === undefined || mascota.nombre.trim().length === 0 || !/^[a-zA-Z\u00C0-\u00FF]*$/.test(mascota.nombre)) {
      this.snackService.errorSnackbar('El nombre de la mascota no debe estar vacío ni contener números');
      save = false;
    }
    else if (mascota.especie === undefined || mascota.especie.trim().length === 0 || !/^[a-zA-Z\u00C0-\u00FF]*$/.test(mascota.especie)) {
      this.snackService.errorSnackbar('La especie de la mascota no debe estar vacío ni contener números');
      save = false;
    }
    else if (mascota.descripcion === undefined || mascota.descripcion === null || !/^[a-zA-Z\u00C0-\u00FF]*$/.test(mascota.descripcion)) {
      this.snackService.errorSnackbar('La descripción de la mascota no debe estar vacío ni contener números');
      save = false;
    }

    console.log(save);
    return save;
  }

  public addMascota(mascota: Mascota) {

    this.idUser = this.tokenService.getId();

    let save = this.validaciones(mascota);
    if (save) {
      this.mascotaService.crearMascota(mascota, this.idUser).subscribe(data => {
        console.log("guardado mascota ok");
        this.interfazService.addRecuerdo(this.mascotas[this.mascotas.length-1]);
      },
        (error: any) => {
          console.log(error)
        }
      );
      this.dialogoRef.close();
    }
  }

}