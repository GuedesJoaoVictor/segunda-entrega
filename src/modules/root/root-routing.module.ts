import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RootComponent} from './root.component';
import {LoginComponent} from './login-component/login.component';
import { RegistrarComponent } from './registrar-component/registrar.component';

const routes: Routes = [
  {path: '', component: RootComponent, children:
      [
        {path: '', redirectTo: 'login', pathMatch: 'full'},
        {path: 'login', component: LoginComponent},
        {path: 'registrar', component: RegistrarComponent}
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootRoutingModule { }
