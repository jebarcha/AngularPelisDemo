import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CarteleraResponse } from '../interfaces/cartelera-response';
import { tap, map, catchError } from 'rxjs/operators';
import { Movie } from './../interfaces/cartelera-response';
import { MovieResponse } from './../interfaces/movie-response';
import { Cast, CreditsResponse } from './../interfaces/credits-response';

@Injectable({
	providedIn: 'root'
})
export class PeliculasService {
	private baseUrl = 'https://api.themoviedb.org/3';
	private carteleraPage = 1;
	public cargando = false;

	constructor(private http: HttpClient) {}

	get params() {
		return {
			api_key: 'a01aadd9cc538e99070de0c0fc49af3f',
			language: 'es-ES',
			page: this.carteleraPage.toString()
		};
	}

	resetCarteleraPage() {
		this.carteleraPage = 1;
	}

	getCartelera(): Observable<Movie[]> {
		if (this.cargando) {
			return of([]);
		}

		this.cargando = true;

		return this.http
			.get<CarteleraResponse>(`${this.baseUrl}/movie/now_playing`, {
				params: this.params
			})
			.pipe(
				map((resp) => resp.results),
				tap(() => {
					this.carteleraPage += 1;
					this.cargando = false;
				})
			);
	}

	buscarPeliculas(query: string): Observable<Movie[]> {
		const params = { ...this.params, page: '1', query };

		// https://api.themoviedb.org/3/search/movie
		return this.http
			.get(`${this.baseUrl}/search/movie`, {
				params
			})
			.pipe(map((resp: any) => resp.results));
	}

	getPeliculaDetalle(id: string) {
		return this.http.get<MovieResponse>(`${this.baseUrl}/movie/${id}`, {
			params: this.params
		}).pipe(
			catchError( err => of(null))
		);
	}

	
	getCast(id: string): Observable<Cast[]> {
		return this.http.get<CreditsResponse>(`${this.baseUrl}/movie/${id}/credits`, {
			params: this.params
		}).pipe(
			map( resp => resp.cast),
			catchError( err => of([])),
		);
	}
}
