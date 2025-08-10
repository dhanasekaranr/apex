process.env['STORYBOOK_ANGULAR_DISABLE_ZONE_JS'] = 'true';

module.exports = {
  stories: ['../src/app/**/*.stories.@(js|ts)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};