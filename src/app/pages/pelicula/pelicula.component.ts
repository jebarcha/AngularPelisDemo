import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PeliculasService } from '../../services/peliculas.service';
import { MovieResponse } from '../../interfaces/movie-response';
import { Location } from '@angular/common';
import { Cast } from '../../interfaces/credits-response';
import { combineLatest } from 'rxjs';

@Component({
	selector: 'app-pelicula',
	templateUrl: './pelicula.component.html',
	styleUrls: [ './pelicula.component.css' ]
})
export class PeliculaComponent implements OnInit {
	public pelicula: MovieResponse;
	public cast: Cast[] = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private peliculasService: PeliculasService,
		private location: Location,
		private router: Router
	) {}

	ngOnInit(): void {
		const { id } = this.activatedRoute.snapshot.params;

		combineLatest([

			this.peliculasService.getPeliculaDetalle(id),
			this.peliculasService.getCast(id)

		]).subscribe( ([ pelicula, cast]) => {
			//console.log(pelicula, cast);
			
			if (!pelicula) {
				this.router.navigateByUrl('/');
				return;
			}

			this.pelicula = pelicula;
			this.cast = cast.filter( actor => actor.profile_path !== null);
		} );


		// this.peliculasService.getPeliculaDetalle(id).subscribe((movie: any) => {
		// 	// console.log(movie);
		// 	if (!movie) {
		// 		this.router.navigateByUrl('/');
		// 		return;
		// 	}

		// 	this.pelicula = movie;
		// });

		// this.peliculasService.getCast(id).subscribe( casting => {
		// 	// console.log(casting);
		// 	this.cast = casting.filter( actor => actor.profile_path !== null);
		// 	// console.log(this.cast);
		// });
	}

	onRegresar() {
		// console.log('Back');
		this.location.back();
	}
}
