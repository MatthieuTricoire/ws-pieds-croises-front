import { Component, computed, input, Signal } from '@angular/core';
import { Message } from '../../models/message';
import {
  BellIcon,
  CalendarIcon,
  CircleAlertIcon,
  InfoIcon,
  LucideAngularModule,
  LucideIconData,
} from 'lucide-angular';
import { NgClass } from '@angular/common';

interface MessageConfig {
  iconName: LucideIconData;
  iconColor: 'text-primary' | 'text-error' | 'text-info' | 'text-success';
}

@Component({
  selector: 'app-message',
  imports: [LucideAngularModule, NgClass],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  message = input.required<Message>();
  messageConfig: Signal<MessageConfig> = computed(() => {
    const messageType = this.message().messageType;
    switch (messageType) {
      case 'REMINDER':
        return { iconName: BellIcon, iconColor: 'text-primary' };
      case 'ALERT':
        return { iconName: CircleAlertIcon, iconColor: 'text-error' };
      case 'EVENT':
        return { iconName: CalendarIcon, iconColor: 'text-success' };
      default:
        return { iconName: InfoIcon, iconColor: 'text-info' };
    }
  });
}
