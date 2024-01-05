import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RasaServiceService } from '../rasa-service.service';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule],
  providers: [RasaServiceService],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.css',
})
export class ChatBotComponent {
  userMessage: string = '';
  chatHistory: any[] = [];

  constructor(private rasaService: RasaServiceService) {}

  sendMessage() {
    this.chatHistory.push({ message: this.userMessage, user: true });
    this.rasaService.sendMessage(this.userMessage).subscribe((response) => {
      this.chatHistory.push({ message: response.text, user: false });
      // Dodajte logiku za obradu odgovora od Rasa chatbota
    });
    this.userMessage = '';
  }
  onInputChange(event: Event) {
    this.userMessage = (event.target as HTMLInputElement).value;
  }
}
