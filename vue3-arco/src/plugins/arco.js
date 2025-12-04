import {
  Button,
  ButtonGroup,
  Input,
  InputNumber,
  Form,
  FormItem,
  Select,
  Option,
  OptionGroup,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Pagination,
  Popover,
  Tooltip,
  Dropdown,
  Doption,
  Menu,
  MenuItem,
  SubMenu,
  MenuItemGroup,
  Divider,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxGroup,
  Cascader,
  DatePicker,
  Drawer,
  Modal,
  Steps,
  Step,
  Tag,
  Empty,
  Avatar,
  Switch,
  Popconfirm,
  Card,
  Row,
  Col,
  TimePicker,
  Message,
  Notification,
} from '@arco-design/web-vue';
import { h, defineComponent } from 'vue';

const componentMap = {
  'el-button': Button,
  'el-button-group': ButtonGroup,
  'el-input': Input,
  'el-input-number': InputNumber,
  'el-form': Form,
  'el-form-item': FormItem,
  'el-select': Select,
  'el-option': Option,
  'el-option-group': OptionGroup,
  'el-tabs': Tabs,
  'el-tab-pane': TabPane,
  'el-table': Table,
  'el-table-column': TableColumn,
  'el-pagination': Pagination,
  'el-popover': Popover,
  'el-tooltip': Tooltip,
  'el-dropdown': Dropdown,
  'el-dropdown-menu': Dropdown,
  'el-dropdown-item': Doption,
  'el-menu': Menu,
  'el-menu-item': MenuItem,
  'el-menu-item-group': MenuItemGroup,
  'el-submenu': SubMenu,
  'el-divider': Divider,
  'el-radio': Radio,
  'el-radio-group': RadioGroup,
  'el-radio-button': RadioButton,
  'el-checkbox': Checkbox,
  'el-checkbox-group': CheckboxGroup,
  'el-cascader': Cascader,
  'el-date-picker': DatePicker,
  'el-drawer': Drawer,
  'el-dialog': Modal,
  'el-step': Step,
  'el-steps': Steps,
  'el-tag': Tag,
  'el-empty': Empty,
  'el-avatar': Avatar,
  'el-switch': Switch,
  'el-popconfirm': Popconfirm,
  'el-card': Card,
  'el-row': Row,
  'el-col': Col,
  'el-time-select': TimePicker,
};

function wrapArcoComponent(component) {
  return defineComponent({
    name: component.name,
    inheritAttrs: false,
    setup(props, { attrs, slots }) {
      return () => h(component, attrs, slots);
    },
  });
}

export function installArcoBridge(app) {
  Object.keys(componentMap).forEach((key) => {
    app.component(key, wrapArcoComponent(componentMap[key]));
  });
  app.component('a-doption', Doption);
  app.config.globalProperties.$message = Message;
  app.config.globalProperties.$notify = Notification;
  app.config.globalProperties.$confirm = Modal.confirm;
  app.use(Button);
  app.use(ButtonGroup);
  app.use(Input);
  app.use(InputNumber);
  app.use(Form);
  app.use(FormItem);
  app.use(Select);
  app.use(Option);
  app.use(OptionGroup);
  app.use(Tabs);
  app.use(TabPane);
  app.use(Table);
  app.use(TableColumn);
  app.use(Pagination);
  app.use(Popover);
  app.use(Tooltip);
  app.use(Dropdown);
  app.use(Menu);
  app.use(MenuItem);
  app.use(MenuItemGroup);
  app.use(SubMenu);
  app.use(Divider);
  app.use(Radio);
  app.use(RadioGroup);
  app.use(RadioButton);
  app.use(Checkbox);
  app.use(CheckboxGroup);
  app.use(Cascader);
  app.use(DatePicker);
  app.use(Drawer);
  app.use(Modal);
  app.use(Steps);
  app.use(Step);
  app.use(Tag);
  app.use(Empty);
  app.use(Avatar);
  app.use(Switch);
  app.use(Popconfirm);
  app.use(Card);
  app.use(Row);
  app.use(Col);
  app.use(TimePicker);
}
