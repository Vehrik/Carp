const $Add_Task_Button = document.querySelector("#add_task_button");
const $Roller = document.querySelector("#roller");
const $Sidebar = document.getElementById("sidebar");
const $Menu_Wrapper = document.getElementById("menu_wrapper");

init_with_classes = (element, ...classes) => {
  element.classList.add(...classes);
  return element;
};

animation_trigger = (element, ...animations) => {
  element.onanimationend = () => {
    element.classList.remove(animations);
  };
  return () => element.classList.add(animations);
};

let dom_switch = (parent, element) => {
  let node_visible = false;

  return () => {
    if (!node_visible) {
      parent.append(element)
      node_visible = true
    } else {
      parent.removeChild(element)
      node_visible = false
    }
  }
}

let chain_dom_nodes = (parent, ...children) => {
  if (children.length == 0) return
  parent.append(chain_dom_nodes(children.shift(), ...children));
  console.log(parent)
  return parent;
};

let fade_out_side_bar = animation_trigger($Sidebar, ["fade_out"]);

//let $NewTaskToolbar = chain_dom_nodes([
//init_with_classes(document.createElement("div"), ["new_task_toolbar_wrapper",]),
//init_with_classes(document.createElement("div"), ["new_task_toolbar"]),
//init_with_classes(document.createElement("button"), ["add_new_subtask_button",]),
//init_with_classes(document.createElement("button"), ["open_task_property_menu_button",]),
//init_with_classes(document.createElement("button"), ["delete_subtask_button",]),
//]);

let new_sub_task = () => chain_dom_nodes(document.querySelector(".sub_task_tray"), [
  init_with_classes(document.createElement("div"), ["sub_task_wrapper",]),
  init_with_classes(document.createElement("div"), ["sub_task"]),
  init_with_classes(document.createElement("div"), ["sub_task_time_dial",]),
  document.createElement("p"),
])


let open_new_task_area_switch = dom_switch(document.body, chain_dom_nodes(
  init_with_classes(document.createElement("div"), ["open_task_wrapper"]),
  init_with_classes(document.createElement("div"), ["open_task"]),
  init_with_classes(document.createElement("div"), ["sub_task_tray"]),
));

console.log(open_new_task_area_switch)

$Add_Task_Button.onclick = () => {
  open_new_task_area_switch();
};
