import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, of, switchMap } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  firebaseApplication: firebase.app.App;
  storage: firebase.storage.Storage;
  // auth: firebase.auth.Auth;
  currentlyLoadedImageURL!: string;

  constructor(private http: HttpClient) {
    this.firebaseApplication = firebase.initializeApp(env.firebase);
    this.storage = firebase.storage();
    // this.auth = firebase.auth();
  }

  updateDataImage(
    img: File | null,
    id: number,
    dataPath: string
  ): Observable<string> {
    if (!img) {
      return of('');
    }

    return from(
      this.storage
        .ref(dataPath)
        .child(id + '')
        .put(img)
    ).pipe(
      switchMap(uploadTask => {
        const ref = uploadTask.ref.getDownloadURL();
        return from(ref);
      })
    );
  }
}
