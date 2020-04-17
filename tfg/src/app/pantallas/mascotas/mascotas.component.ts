import { Component, OnInit } from '@angular/core';
import { PersonaService } from 'src/app/core/services/persona/persona.service';
import { Persona } from 'src/app/core/clases/clases';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.component.html',
  styleUrls: ['./mascotas.component.scss']
})
export class MascotasComponent implements OnInit {

  persona: Persona = null;

  constructor(private personaService: PersonaService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params.id;
    this.personaService.getPersonaPorId(id).subscribe(data => {
      this.persona = data;
    },
      err => {
        this.router.navigate(['personas']);
      }
    );
  }

  volver(): void {
    window.history.back();
  }

}
