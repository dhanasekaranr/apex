import { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Shared/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Button Component

A reusable, Material 3-compliant button for your Angular app.

- **Props:** \`label\`, \`color\`, \`disabled\`, \`type\`
- **Usage:** \`<app-button label=\"Save\" color=\"accent\"></app-button>\`
        `,
      },
    },
  },
};
export default meta;

type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: { label: 'Primary', color: 'primary' },
};

export const Accent: Story = {
  args: { label: 'Accent', color: 'accent' },
};

export const Warn: Story = {
  args: { label: 'Warn', color: 'warn' },
};
