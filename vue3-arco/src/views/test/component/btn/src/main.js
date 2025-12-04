import vue from "vue";
import btn from "./main.vue";
const btnConstructor = vue.extend(btn);

function Btn() {
  const btnInstance = new btnConstructor();
  btnInstance.$mount();
  const btnEl = btnInstance.$el;
  document.body.append(btnEl);

  return {
    setIndex(index) {
      btnInstance.index = index;
    },
  };
}

export default Btn;
