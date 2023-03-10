const UI = {}
UI.add_task_button = document.getElementById("add_task_button");
UI.roller = document.getElementById("roller");
UI.sidebar = document.getElementById("sidebar");
UI.menu_wrapper = document.getElementById("menu_wrapper");

let component = (ui) => (type) => (...classes) => {
  let _ = document.createElement(type)
  if (classes.length == 0) return _
  _.classList.add(...classes)
  ui[`${classes[0]}`] = _
  return _
}
let div = (ui) => (...styles) => component(ui)('div')(...styles)
let p = (ui) => (...styles) => component(ui)('p')(...styles)

const Triggers = {}
let trigger = (type) => (...senders) => (...actions) => {
  senders.forEach(sender => {
    actions.forEach(action => {
      sender.addEventListener(type, action)
    })
  })
}
Triggers.on_click = trigger('click')
Triggers.on_hover = trigger('mouseover')

const Actions = {}
Actions.toggle = (is_visible = false) => (...sources) => (target) => {
  return () => {
    if (!is_visible) {
      is_visible = true
      sources.forEach(source => source.append(target))
    } else {
      is_visible = false
      sources.forEach(source => source.removeChild(target))
    }
  }
}
Actions.toggle_on_then_off = Actions.toggle(false)
Actions.toggle_off_then_on = Actions.toggle(true)
Actions.toggle_after_animation = (...targets) => (...animation_names) => (toggle) => {
  targets.forEach((target) => {
    target.addEventListener('animationend', (e) => {
      if (animation_names.includes(e.animationName)) {
        toggle()
      }
      target.classList.remove(...animation_names)
    })
  })
  return () => targets.forEach(target => target.classList.add(animation_names))
};

const new_task_area = (ui) => {
  let tray = div(ui)('open_task_wrapper', 'slide_in_from_left')
  let toggle_new_task_area = Actions.toggle_on_then_off(ui.sidebar)(tray)
  tray.append(div(ui)('close_task_tray_button'))
  tray.append(div(ui)('open_task'))
  tray.append(div(ui)('sub_task_tray'))
  Triggers.on_click(ui.add_task_button)(toggle_new_task_area)
  Triggers.on_click(ui.close_task_tray_button)(Actions.toggle_after_animation(tray)('slide_out_to_left')(toggle_new_task_area))
}

const init_ui = (ui) => (...sub_routines) => {
  sub_routines.forEach((sub_routine) => sub_routine(ui))
}

init_ui(UI)(new_task_area)
