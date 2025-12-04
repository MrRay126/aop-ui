import SvgIcon from '@/components/SvgIcon';

const svgIcons = import.meta.glob('./svg/*.svg', { eager: true });

export default (app) => {
  app.component('svg-icon', SvgIcon);
  Object.keys(svgIcons).forEach((path) => {
    const name = path.replace('./svg/', '').replace('.svg', '');
    // no-op, import for bundler
    return name;
  });
};
