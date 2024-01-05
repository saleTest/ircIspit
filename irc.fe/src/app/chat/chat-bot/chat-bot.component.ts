import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RasaServiceService } from '../rasa-service.service';
import { AppModule } from '../../app.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, AppModule, FormsModule],
  providers: [RasaServiceService],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.css',
})
export class ChatBotComponent {
  userMessage: string = '';
  chatHistory: any[] = [];

  constructor(private rasaService: RasaServiceService) {}

  sendMessage(event: Event) {
    this.chatHistory.push({ message: this.userMessage, user: true });
    this.rasaService.sendMessage(this.userMessage).subscribe((response) => {
      this.chatHistory.push({ message: response.text, user: false });
      // Logika za dodatnu obradu odgovora od Rasa ChatBota
    });
    this.userMessage = ''; // Resetirajte polje za unos nakon slanja poruke
  }

  onInputChange(event: Event) {
    this.userMessage = (event.target as HTMLInputElement).value;
  }
}
