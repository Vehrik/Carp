const $Add_Task_Button = document.querySelector("#add_task_button");
const $Roller = document.querySelector("#roller");
const $Sidebar = document.getElementById("sidebar");
const $Menu_Wrapper = document.getElementById("menu_wrapper");

let div = (...classes) => {
  let _ = document.createElement('div')
  if (classes.length == 0) return _
  _.classList.add(classes)
  return _
}


init_component = (component) => {
  let component_root = null
  Object.entries(component).forEach((sub_component) => {
    if (!(sub_component[1] instanceof HTMLElement)) {
      sub_component[1] = init_component(sub_component[1])
    } else {
      sub_component[1].classList.add(sub_component[0]);
    }
    if (component_root == null) {
      component_root = sub_component[1]
    } else {
      component_root.append(sub_component[1])
    }
  })
  return component_root
}


animation_trigger = (element, animations, ...afterAnimationHooks) => {
  element.onanimationend = (e) => {
    element.classList.remove(animations);
    afterAnimationHooks.forEach((hook) => hook(e, element, animations))
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

let fade_out_side_bar = animation_trigger($Sidebar, ["fade_out"]);

//let $NewTaskToolbar = chain_dom_nodes([
//init_with_classes(document.createElement("div"), ["new_task_toolbar_wrapper",]),
//init_with_classes(document.createElement("div"), ["new_task_toolbar"]),
//init_with_classes(document.createElement("button"), ["add_new_subtask_button",]),
//init_with_classes(document.createElement("button"), ["open_task_property_menu_button",]),
//init_with_classes(document.createElement("button"), ["delete_subtask_button",]),
//]);

let new_sub_task = init_component({
  sub_task_wrapper: div(),
  sub_task: div(),
  sub_task_time_dial: div(),
  sub_task_text: document.createElement("p"),
})


let tray_button = div()
tray_button.innerText = "x"

let open_task_wrapper = div('slide_in_from_left')
let open_new_task_area_switch = dom_switch(document.body, init_component({
  _: { open_task_wrapper: open_task_wrapper, close_task_tray_button: tray_button },
  open_task: div(),
  sub_task_tray: div()
}))

let slide_tray_away = animation_trigger(open_task_wrapper, 'slide_out_to_below', (e) => {
  if (e.animationName == "slide_out_to_left") {
    open_new_task_area_switch()
  }

})
tray_button.onclick = slide_tray_away
$Add_Task_Button.onclick = open_new_task_area_switch;

