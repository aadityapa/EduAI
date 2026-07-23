import type { Preview, Decorator } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/globals.css';

/**
 * Theme activation (class strategy, matches production):
 * - light: no class
 * - dark: `dark` on `<html>`
 * - high-contrast: `high-contrast`
 * - dark + high-contrast: both classes (manual / stacked)
 */
const withThemeClass: Decorator = withThemeByClassName({
  themes: {
    light: '',
    dark: 'dark',
    'high-contrast': 'high-contrast',
    'dark high-contrast': 'dark high-contrast',
  },
  defaultTheme: 'light',
});

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: 'padded',
    a11y: { test: 'todo' },
    options: {
      storySort: {
        order: ['Introduction', 'Foundations', 'Components', 'Domain'],
      },
    },
  },
  decorators: [
    withThemeClass,
    (Story) => (
      <div
        style={{
          fontFamily:
            'Inter, Noto Sans Devanagari, Segoe UI, system-ui, sans-serif',
          minHeight: '100%',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
