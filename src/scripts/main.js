const $Add_Task_Button = document.querySelector("#add_task_button")
const $Roller = document.querySelector("#roller")
const $Sidebar = document.getElementById("sidebar")
const $Menu_Wrapper = document.getElementById("menu_wrapper")

init_with_classes = (element, ...classes) => {
  element.classList.add(...classes)
  return element
}

animation_trigger = (element, ...animations) => 
{
  element.onanimationend = () => {
    element.classList.remove(animations)  
  }
  
  console.log(animations)
  return () => element.classList.add(animations)
    
}

let fade_out_side_bar_trigger = animation_trigger($Sidebar, ["fade_out"])

let new_task_toolbar = () => {}

let open_task = () => {
  let $ = {
    sub_task_wrapper: init_with_classes(document.createElement('div'), ["sub_task_wrapper"]),
    sub_task: init_with_classes(document.createElement('div'), ["sub_task"]),
    sub_task_time_dial: init_with_classes(document.createElement('div'), ["sub_task_time_dial"]),
    p:  document.createElement('p'),
  }

  $.sub_task_tray.append($.sub_task_wrapper)
  $.sub_task_wrapper.append($.sub_task)
  $.sub_task.append($.p)
}

let open_new_task_area_switch = () => {
  let $ = {
    new_task_wrapper: init_with_classes(document.createElement('div'), ["open_task_wrapper"]),
    open_task: init_with_classes(document.createElement('div'), ["open_task"]),
    sub_task_tray: init_with_classes(document.createElement('div'), ["sub_task_tray"]),
  }

  return () => {
    document.body.prepend($.new_task_wrapper)
    $.new_task_wrapper.append($.open_task)
    $.new_task_wrapper.append($.sub_task_tray)
  }
}

$Add_Task_Button.onclick = () => {
  open_new_task_area_switch()();
  fade_out_side_bar_trigger()
}
