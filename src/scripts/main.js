const UI = {};
UI.add_task_button = document.getElementById("add_task_button");
UI.roller = document.getElementById("roller");
UI.sidebar = document.getElementById("sidebar");
UI.menu_wrapper = document.getElementById("menu_wrapper");

let component = ui => type => (...classes) => {
  let _ = document.createElement(type);
  if (classes.length == 0) return _;
  _.classList.add(...classes);
  ui[`${classes[0]}`] = _;
  return _;
};

let component_tree = ui => (...components) => {
  let root;
  components.forEach(_component => {
    if (root == undefined) {
      root = Array.isArray(_component)
        ? component_tree(ui)(..._component)
        : _component(ui);
    } else {
      root.append(
        Array.isArray(_component)
          ? component_tree(ui)(..._component)
          : _component(ui)
      );
    }
  });
  return root;
};

let div = (...styles) => ui => component(ui)("div")(...styles);

let p = (...styles) => ui => component(ui)("p")(...styles);

let btn = (...styles) => ui => component(ui)("button")(...styles);

let trigger = type => (...senders) => (...actions) => {
  senders.forEach(sender => {
    actions.forEach(action => {
      sender.addEventListener(type, action);
    });
  });
};
const Triggers = {};
Triggers.on_click = trigger("click");
Triggers.on_hover = trigger("mouseover");

const Actions = {};
Actions.toggle =
  (init_visibility) =>
    (...bins) =>
      (...packages) => {
        is_visible = init_visibility
        return () => {
          if (is_visible) {
            is_visible = false;
            bins.forEach(bin => {
              packages.forEach(package => bin.removeChild(package))
            });
          } else {
            is_visible = true;
            bins.forEach(bin => bin.append(...packages));
          }
        };
      };
Actions.toggle_on_then_off = Actions.toggle(false);
Actions.toggle_off_then_on = Actions.toggle(true);
Actions.do_after_animation =
  (...targets) =>
    (...animation_names) =>
      (...actions) => {
        targets.forEach(target => {
          target.addEventListener("animationend", e => {
            if (animation_names.includes(e.animationName)) {
              actions.forEach(action => action());
            }
            target.classList.remove(...animation_names);
          });
        });
        return () =>
          targets.forEach(target => target.classList.add(...animation_names));
      };


const wrap_initializers = (...initializers) => ui => task => {
  let wrapped_initializers = [];
  initializers.forEach(initializer => {
    wrapped_initializers.push(() => initializer(ui)(task));
  });
  return wrapped_initializers;
};

const unwrap_initializers = wrapped_initializers => () => {
  wrapped_initializers.forEach(initializer => initializer());
};

const _init_task = (...init_sequence) => task => ui => {
  let pkg = wrap_initializers(...init_sequence)(ui)(task);
  Actions.do_after_animation(task)("slide_in_from_left")(
    unwrap_initializers(pkg)
  );
};


task_on_hover = () => task => {
  task.classList.add("initd_task");
};

task_on_click = ui => task => {
  let _ui = {};
  component_tree(_ui)(
    [
      div("open_task_wrapper", "slide_in_from_left_with_fade"),
      div("close_task_tray_button"),
      div("open_task"),
      div("sub_task_menu_tray"),
      div("sub_task_tray"),
    ],
  );
  _ui.close_task_tray_button.innerText = '+'
  _ui.sub_task_menu_tray.innerText = '...'


  let toggle_open_task = Actions.toggle_on_then_off(document.body)(_ui.open_task_wrapper)
  Triggers.on_click(_ui.close_task_tray_button)(
    () => (ui.open_task = {}),
    () => task.classList.remove("task_is_open"),
    () => task.classList.add('initd_task'),
    Actions.do_after_animation(_ui.open_task_wrapper)("slide_out_to_left")(
      toggle_open_task
    ),
  )
  Triggers.on_click(task)(
    () => (ui.open_task = _ui),
    toggle_open_task,
  );
};

const init_task = _init_task(task_on_hover, task_on_click);

const new_task = ui => {
  let _ui = {};
  let task = () => div("task", "slide_in_from_left")(_ui);
  let add_new_task = () => {
    let new_task = task();
    //We init after slide-in animation to avoid the way css handles overlapping animations
    //Init-ing before slide-in results in the corners of the task divs 'sticking' to the
    //edges of the wrapper div
    init_task(new_task)(_ui);
    ui.roller.prepend(new_task);
  };
  Triggers.on_click(ui.add_task_button)(add_new_task);
};

const init_ui = ui => (...sub_routines) => {
  sub_routines.forEach(sub_routine => sub_routine(ui));
};

init_ui(UI)(new_task);
console.log(UI);
