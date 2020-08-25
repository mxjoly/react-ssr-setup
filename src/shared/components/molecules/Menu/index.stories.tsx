import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { action } from '@storybook/addon-actions';

import Menu, { MenuProps } from '.';

export default {
  component: Menu,
  title: 'Molecules/Menu',
  parameters: {
    docs: {
      description: {
        component:
          'This component allows you to select a value in a list of items. You can change the appearance of the button by using the props `noDropIcon`, `capitalize` and `uppercase`.',
      },
    },
  },
  args: {
    // Default props passed to all the stories
    defaultItem: 'en',
    items: ['en', 'fr'],
    onSelect: action('onSelect'),
    noDropIcon: false,
  },
} as Meta;

const Template: Story<MenuProps> = (args: MenuProps) => <Menu {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Default';

export const WithNoDropIcon = Template.bind({});
WithNoDropIcon.storyName = 'With no drop icon';
WithNoDropIcon.args = { noDropIcon: true };
WithNoDropIcon.parameters = {
  docs: {
    description: {
      story: 'You can remove the drop icon by adding the props `noDropIcon`.',
    },
  },
};

export const WithCapitalization = Template.bind({});
WithCapitalization.storyName = 'With capitalization';
WithCapitalization.args = { capitalize: true };
WithCapitalization.parameters = {
  docs: {
    description: {
      story: 'You can capitalize the words by adding the props `capitalize`.',
    },
  },
};

export const WithUppercasedLetters = Template.bind({});
WithUppercasedLetters.storyName = 'With uppercase letters';
WithUppercasedLetters.args = { uppercase: true };
WithUppercasedLetters.parameters = {
  docs: {
    description: {
      story:
        'You can change letters to uppercase by adding the props `uppercase`.',
    },
  },
};
