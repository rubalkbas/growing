import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { ScrumboardService } from './scrumboard.service';
import { ScrumboardBoardComponent } from './board/board.component';
import { Board } from './scrumboard.models';


export default [
    {
        path     : ':boardId',
        data     : {
            permission: 'Scrumboard'
        },
        component: ScrumboardBoardComponent,
    },
] as Routes;
