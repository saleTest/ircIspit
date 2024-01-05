import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { ProductsComponentComponent } from './pages/products-component/products-component.component';
import { OneProductComponent } from './pages/products-component/one-product/one-product.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { CommentComponent } from './pages/products-component/comment/comment.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrderCheckoutComponent } from './pages/order-checkout/order-checkout.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { UpdateProductComponent } from './pages/update-product/update-product.component';
import { MouseSimulationComponent } from './mouseMovement/mouse-simulation/mouse-simulation.component';
import { ChatBotComponent } from './chat/chat-bot/chat-bot.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'addProduct', component: AddProductComponent },
  { path: 'updateProduct/:id', component: UpdateProductComponent },
  { path: 'products', component: ProductsComponentComponent },
  { path: 'products/:id', component: OneProductComponent },
  { path: 'products/:id/comments', component: CommentComponent },
  { path: 'order-checkout', component: OrderCheckoutComponent },
  // { path: 'products/:id/comments/:id', component: CommentComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'order-history', component: OrderHistoryComponent },
  { path: 'simulation', component: MouseSimulationComponent },
  { path: 'cart', component: CartComponent },
  { path: 'bot', component: ChatBotComponent },
  { path: '**', component: WelcomeComponent },
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
// })
// export class AppRoutingModule {}
