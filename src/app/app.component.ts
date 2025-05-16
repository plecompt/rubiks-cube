import { Component, OnInit } from '@angular/core';
import { Color, Face } from './models/cube.models';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent implements OnInit {
  cube = {
    up: this.createFace('white'),
    down: this.createFace('yellow'),
    front: this.createFace('green'),
    back: this.createFace('blue'),
    left: this.createFace('orange'),
    right: this.createFace('red'),
  };

  ngOnInit(): void {
  }

  createFace(color: Color): Face {
    return [
      [color, color, color],
      [color, color, color],
      [color, color, color],
    ];
  }

  getCube() {
    // Convertion un objet en tableau afin de pouvoir iterer sur chaque face dans la vue
    return Object.entries(this.cube).map(([key, value]) => ({ key, value }));
  }

  getCubeColor(face: 'up' | 'down' | 'left' | 'right' | 'front' | 'back', row: number, col: number): string {
    const colorMap: { [key: string]: string } = {
      'white': '#FFFFFF',
      'yellow': '#FFFF00',
      'green': '#00FF00',
      'blue': '#0000FF',
      'red': '#FF0000',
      'orange': '#FFA500',
    }
      // Supposant que votre cube stocke des noms de couleurs comme 'white', 'yellow', etc.
    const color = this.cube[face][row][col]; 
    return colorMap[color] || color; // Retourne la valeur mappée ou la couleur originale
  }
  
  //Mouvement de base
  // Up - Rotation horaire de la face supérieure
  transformUp() {
    //left devient front, back devient left, right devient back, front devient right
    const tempRow = this.cube.front[0];

    this.cube.front[0] = this.cube.right[0];
    this.cube.right[0] = this.cube.back[0];
    this.cube.back[0] = this.cube.left[0];
    this.cube.left[0] = tempRow;

    this.rotateFaceClockwise('up');
  }

  // Down - Rotation horaire de la face inférieure
  transformDown() {
    //front devient left, left devient back, back devient right, right devient front
    const tempRow = this.cube.front[2];

    this.cube.front[2] = this.cube.left[2];
    this.cube.left[2] = this.cube.back[2];
    this.cube.back[2] = this.cube.right[2];
    this.cube.right[2] = tempRow;

    this.rotateFaceClockwise('down');
  }

  // Left - Rotation horaire de la face gauche
  transformLeft() {
    const tempUpCol = [this.cube.up[0][0], this.cube.up[1][0], this.cube.up[2][0]];
    const tempFrontCol = [this.cube.front[0][0], this.cube.front[1][0], this.cube.front[2][0]];
    const tempDownCol = [this.cube.down[0][0], this.cube.down[1][0], this.cube.down[2][0]];
    const tempBackCol = [this.cube.back[2][2], this.cube.back[1][2], this.cube.back[0][2]]; // Inversée car la face arrière est miroir

    [this.cube.up[0][0], this.cube.up[1][0], this.cube.up[2][0]] = tempBackCol;
    // Front ← Up
    [this.cube.front[0][0], this.cube.front[1][0], this.cube.front[2][0]] = tempUpCol;
    // Down ← Front
    [this.cube.down[0][0], this.cube.down[1][0], this.cube.down[2][0]] = tempFrontCol;
    // Back (inversé) ← Down
    [this.cube.back[2][2], this.cube.back[1][2], this.cube.back[0][2]] = tempDownCol;

    this.rotateFaceClockwise('left');
  }

  // Right - Rotation horaire de la face droite
  transformRight() {
    const tempUpCol = [this.cube.up[0][2], this.cube.up[1][2], this.cube.up[2][2]];
    const tempFrontCol = [this.cube.front[0][2], this.cube.front[1][2], this.cube.front[2][2]];
    const tempDownCol = [this.cube.down[0][2], this.cube.down[1][2], this.cube.down[2][2]];
    const tempBackCol = [this.cube.back[2][0], this.cube.back[1][0], this.cube.back[0][0]]; // Inversée car la face arrière est miroir
  
    // Up ← Front
    [this.cube.up[0][2], this.cube.up[1][2], this.cube.up[2][2]] = tempFrontCol;
    
    // Back (inversé) ← Up
    [this.cube.back[2][0], this.cube.back[1][0], this.cube.back[0][0]] = tempUpCol;
    
    // Down ← Back (inversé)
    [this.cube.down[0][2], this.cube.down[1][2], this.cube.down[2][2]] = tempBackCol;
    
    // Front ← Down
    [this.cube.front[0][2], this.cube.front[1][2], this.cube.front[2][2]] = tempDownCol;

    this.rotateFaceClockwise('right');
  }

  // Front - Rotation horaire de la face avant
  transformFront() {
    const tempUpRow = this.cube.up[2];
    const tempRightCol = [this.cube.right[0][0], this.cube.right[1][0], this.cube.right[2][0]];
    const tempDownRow = [this.cube.down[0][2], this.cube.down[0][1], this.cube.down[0][0]]; // Inversée
    const tempLeftCol = [this.cube.left[0][2], this.cube.left[1][2], this.cube.left[2][2]];
  
    // Up → Right
    [this.cube.right[0][0], this.cube.right[1][0], this.cube.right[2][0]] = tempUpRow;
    
    // Right → Down (inversée)
    [this.cube.down[0][2], this.cube.down[0][1], this.cube.down[0][0]] = tempRightCol;
    
    // Down (inversée) → Left
    [this.cube.left[0][2], this.cube.left[1][2], this.cube.left[2][2]] = tempDownRow;
    
    // Left → Up
    this.cube.up[2] = tempLeftCol;

    this.rotateFaceClockwise('front');
  }

  // Back - Rotation horaire de la face arrière
  transformBack() {
    const tempUpRow = this.cube.up[0];
    const tempRightCol = [this.cube.right[0][2], this.cube.right[1][2], this.cube.right[2][2]];
    const tempDownRow = [this.cube.down[2][2], this.cube.down[2][1], this.cube.down[2][0]]; // Inversée
    const tempLeftCol = [this.cube.left[0][0], this.cube.left[1][0], this.cube.left[2][0]];
  
    // Up → Left
    [this.cube.left[0][0], this.cube.left[1][0], this.cube.left[2][0]] = tempUpRow;
    
    // Left → Down (inversée)
    [this.cube.down[2][2], this.cube.down[2][1], this.cube.down[2][0]] = tempLeftCol;
    
    // Down (inversée) → Right
    [this.cube.right[0][2], this.cube.right[1][2], this.cube.right[2][2]] = tempDownRow;
    
    // Right → Up
    this.cube.up[0] = tempRightCol;

    this.rotateFaceClockwise('back');
  }

  //Mouvement de base inverse
  // Up - Rotation anti-horaire de la face supérieure
  transformUpReverse() {
    //front devient left, left devient back, back devient right, right devient front
    const tempRow = this.cube.front[0];

    this.cube.front[0] = this.cube.left[0];
    this.cube.left[0] = this.cube.back[0];
    this.cube.back[0] = this.cube.right[0];
    this.cube.right[0] = tempRow;

    this.rotateFaceCounterClockwise('up');
  }

  // Down - Rotation anti-horaire de la face inférieure
  transformDownReverse() {
        //left devient front, back devient left, right devient back, front devient right
        const tempRow = this.cube.front[2];

        this.cube.front[2] = this.cube.right[2];
        this.cube.right[2] = this.cube.back[2];
        this.cube.back[2] = this.cube.left[2];
        this.cube.left[2] = tempRow;

        this.rotateFaceCounterClockwise('down');
  }

  // Left - anti-Rotation horaire de la face gauche
  transformLeftReverse() {
    const tempUpCol = [this.cube.up[0][0], this.cube.up[1][0], this.cube.up[2][0]];
    const tempFrontCol = [this.cube.front[0][0], this.cube.front[1][0], this.cube.front[2][0]];
    const tempDownCol = [this.cube.down[0][0], this.cube.down[1][0], this.cube.down[2][0]];
    const tempBackCol = [this.cube.back[2][2], this.cube.back[1][2], this.cube.back[0][2]]; // Inversée
  
    // Up ← Front
    [this.cube.up[0][0], this.cube.up[1][0], this.cube.up[2][0]] = tempFrontCol;
    
    // Front ← Down
    [this.cube.front[0][0], this.cube.front[1][0], this.cube.front[2][0]] = tempDownCol;
    
    // Down ← Back (inversée)
    [this.cube.down[0][0], this.cube.down[1][0], this.cube.down[2][0]] = tempBackCol;
    
    // Back (inversée) ← Up
    [this.cube.back[2][2], this.cube.back[1][2], this.cube.back[0][2]] = tempUpCol;

    this.rotateFaceCounterClockwise('left');
  }

  // Right - anti-Rotation horaire de la face droite
  transformRightReverse() {
    const tempUpCol = [this.cube.up[0][2], this.cube.up[1][2], this.cube.up[2][2]];
    const tempFrontCol = [this.cube.front[0][2], this.cube.front[1][2], this.cube.front[2][2]];
    const tempDownCol = [this.cube.down[0][2], this.cube.down[1][2], this.cube.down[2][2]];
    const tempBackCol = [this.cube.back[2][0], this.cube.back[1][0], this.cube.back[0][0]]; // Inversée
  
    // Up ← Back (inversée)
    [this.cube.up[0][2], this.cube.up[1][2], this.cube.up[2][2]] = tempBackCol;
    
    // Back (inversée) ← Down
    [this.cube.back[2][0], this.cube.back[1][0], this.cube.back[0][0]] = tempDownCol;
    
    // Down ← Front
    [this.cube.down[0][2], this.cube.down[1][2], this.cube.down[2][2]] = tempFrontCol;
    
    // Front ← Up
    [this.cube.front[0][2], this.cube.front[1][2], this.cube.front[2][2]] = tempUpCol;

    this.rotateFaceCounterClockwise('right');
  }

  // Front - anti-Rotation horaire de la face avant
  transformFrontReverse() {
    const tempUpRow = this.cube.up[2];
    const tempRightCol = [this.cube.right[0][0], this.cube.right[1][0], this.cube.right[2][0]];
    const tempDownRow = [this.cube.down[0][2], this.cube.down[0][1], this.cube.down[0][0]]; // Inversée
    const tempLeftCol = [this.cube.left[0][2], this.cube.left[1][2], this.cube.left[2][2]];
  
    // Up → Left
    [this.cube.left[0][2], this.cube.left[1][2], this.cube.left[2][2]] = tempUpRow;
    
    // Left → Down (inversée)
    [this.cube.down[0][2], this.cube.down[0][1], this.cube.down[0][0]] = tempLeftCol;
    
    // Down (inversée) → Right
    [this.cube.right[0][0], this.cube.right[1][0], this.cube.right[2][0]] = tempDownRow;
    
    // Right → Up
    this.cube.up[2] = tempRightCol;

    this.rotateFaceCounterClockwise('front');
  }

  // Back - anti-Rotation horaire de la face arrière
  transformBackReverse() {
    const tempUpRow = this.cube.up[0];
    const tempRightCol = [this.cube.right[0][2], this.cube.right[1][2], this.cube.right[2][2]];
    const tempDownRow = [this.cube.down[2][2], this.cube.down[2][1], this.cube.down[2][0]]; // Inversée
    const tempLeftCol = [this.cube.left[0][0], this.cube.left[1][0], this.cube.left[2][0]];
  
    // Up → Right
    [this.cube.right[0][2], this.cube.right[1][2], this.cube.right[2][2]] = tempUpRow;
    
    // Right → Down (inversée)
    [this.cube.down[2][2], this.cube.down[2][1], this.cube.down[2][0]] = tempRightCol;
    
    // Down (inversée) → Left
    [this.cube.left[0][0], this.cube.left[1][0], this.cube.left[2][0]] = tempDownRow;
    
    // Left → Up
    this.cube.up[0] = tempLeftCol;

    this.rotateFaceCounterClockwise('back');
  }

  rotateFaceClockwise(face: 'up' | 'down' | 'left' | 'right' | 'front' | 'back') {
    const matrix = this.cube[face];
    const n = matrix.length;
    
    // Create a copy of the matrix
    const temp = JSON.parse(JSON.stringify(matrix));
    
    // Rotate 90 degrees clockwise
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        matrix[j][n-1-i] = temp[i][j];
      }
    }
  }
  
  rotateFaceCounterClockwise(face: 'up' | 'down' | 'left' | 'right' | 'front' | 'back') {
    for(let i=0; i < 3; i++){
      this.rotateFaceClockwise(face);
    }
  }

}
