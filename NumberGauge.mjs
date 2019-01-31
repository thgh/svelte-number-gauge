function noop() {}

function run(fn) {
	return fn();
}

function blankObject() {
	return Object.create(null);
}

function run_all(fns) {
	fns.forEach(run);
}

function is_function(thing) {
	return typeof thing === 'function';
}

function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function append(target, node) {
	target.appendChild(node);
}

function insert(target, node, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function destroyEach(iterations, detach) {
	for (var i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d(detach);
	}
}

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function children (element) {
	return Array.from(element.childNodes);
}

function setData(text, data) {
	text.data = '' + data;
}

function setStyle(node, key, value) {
	node.style.setProperty(key, value);
}

let current_component;

function set_current_component(component) {
	current_component = component;
}

let dirty_components = [];

let update_scheduled = false;
const binding_callbacks = [];
const render_callbacks = [];

function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		queue_microtask(flush);
	}
}

function add_render_callback(fn) {
	render_callbacks.push(fn);
}

function flush() {
	const seen_callbacks = new Set();

	do {
		// first, call beforeUpdate functions
		// and update components
		while (dirty_components.length) {
			const component = dirty_components.shift();
			set_current_component(component);
			update(component.$$);
		}

		while (binding_callbacks.length) binding_callbacks.shift()();

		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		while (render_callbacks.length) {
			const callback = render_callbacks.pop();
			if (!seen_callbacks.has(callback)) {
				callback();

				// ...so guard against infinite loops
				seen_callbacks.add(callback);
			}
		}
	} while (dirty_components.length);

	update_scheduled = false;
}

function update($$) {
	if ($$.fragment) {
		$$.update($$.dirty);
		run_all($$.before_render);
		$$.fragment.p($$.dirty, $$.ctx);
		$$.dirty = null;

		$$.after_render.forEach(add_render_callback);
	}
}

function queue_microtask(callback) {
	Promise.resolve().then(() => {
		if (update_scheduled) callback();
	});
}

function mount_component(component, target, anchor) {
	const { fragment, on_mount, on_destroy, after_render } = component.$$;

	fragment.m(target, anchor);

	// onMount happens after the initial afterUpdate. Because
	// afterUpdate callbacks happen in reverse order (inner first)
	// we schedule onMount callbacks before afterUpdate callbacks
	add_render_callback(() => {
		const new_on_destroy = on_mount.map(run).filter(is_function);
		if (on_destroy) {
			on_destroy.push(...new_on_destroy);
		} else {
			// Edge case — component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});

	after_render.forEach(add_render_callback);
}

function destroy(component, detach) {
	if (component.$$) {
		run_all(component.$$.on_destroy);
		component.$$.fragment.d(detach);

		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		component.$$.on_destroy = component.$$.fragment = null;
		component.$$.ctx = {};
	}
}

function make_dirty(component, key) {
	if (!component.$$.dirty) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty = {};
	}
	component.$$.dirty[key] = true;
}

function init(component, options, instance, create_fragment, not_equal$$1) {
	const parent_component = current_component;
	set_current_component(component);

	const props = options.props || {};

	const $$ = component.$$ = {
		fragment: null,
		ctx: null,

		// state
		update: noop,
		not_equal: not_equal$$1,
		bound: blankObject(),

		// lifecycle
		on_mount: [],
		on_destroy: [],
		before_render: [],
		after_render: [],
		context: new Map(parent_component ? parent_component.$$.context : []),

		// everything else
		callbacks: blankObject(),
		dirty: null
	};

	let ready = false;

	$$.ctx = instance
		? instance(component, props, (key, value) => {
			if ($$.bound[key]) $$.bound[key](value);

			if ($$.ctx) {
				const changed = not_equal$$1(value, $$.ctx[key]);
				if (ready && changed) {
					make_dirty(component, key);
				}

				$$.ctx[key] = value;
				return changed;
			}
		})
		: props;

	$$.update();
	ready = true;
	run_all($$.before_render);
	$$.fragment = create_fragment($$.ctx);

	if (options.target) {
		if (options.hydrate) {
			$$.fragment.l(children(options.target));
		} else {
			$$.fragment.c();
		}

		mount_component(component, options.target, options.anchor);
		if (options.intro && component.$$.fragment.i) component.$$.fragment.i();
		flush();
	}

	set_current_component(parent_component);
}

class SvelteComponent {
	$destroy() {
		destroy(this, true);
		this.$destroy = noop;
	}

	$on(type, callback) {
		const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
		callbacks.push(callback);

		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	$set() {
		// overridden by instance, if it has props
	}
}

/* NumberGauge.html generated by Svelte v3.0.0-alpha19 */

function add_css() {
	var style = createElement("style");
	style.id = 'svelte-1w3m8rz-style';
	style.textContent = ".gauge.svelte-1w3m8rz{position:relative;width:4em;height:2em;box-sizing:border-box}.gauge-fill.svelte-1w3m8rz{position:absolute;z-index:2;background:red;width:100%;height:100%;border-radius:2em 2em 0 0;transition:transform 0.2s;transform-origin:50% 100%}.gauge-bg.svelte-1w3m8rz{z-index:1;background:#ccc}.gauge-max.svelte-1w3m8rz{position:absolute;z-index:2;left:-6px;top:-6px;width:6px;height:0;border-top:6px solid transparent;border-bottom:6px solid transparent;border-left:6px solid #000}.gauge-overflow.svelte-1w3m8rz{position:absolute;width:100%;height:100%;overflow:hidden}.gauge-abs.svelte-1w3m8rz{position:absolute;z-index:0;background:red;width:100%;height:0;border-radius:2em 2em 0 0;transition:transform 0.2s;left:0%;top:100%}.gauge-value.svelte-1w3m8rz{position:absolute;z-index:4;bottom:0;left:0;right:0;text-align:center;font-weight:bold;line-height:1em}.gauge-white.svelte-1w3m8rz{position:absolute;z-index:3;top:20%;left:10%;width:80%;height:160%;border-radius:100%;background:white}";
	append(document.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.degree = list[i];
	return child_ctx;
}

// (51:2) {#each degrees as degree}
function create_each_block(ctx) {
	var div1, div0;

	return {
		c() {
			div1 = createElement("div");
			div0 = createElement("div");
			div0.className = "gauge-max svelte-1w3m8rz";
			div1.className = "gauge-abs svelte-1w3m8rz";
			setStyle(div1, "transform", "rotate(" + ctx.degree + "deg)");
		},

		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
		},

		p(changed, ctx) {
			if (changed.degrees) {
				setStyle(div1, "transform", "rotate(" + ctx.degree + "deg)");
			}
		},

		d(detach) {
			if (detach) {
				detachNode(div1);
			}
		}
	};
}

function create_fragment(ctx) {
	var div5, text0, div4, div0, text1, div1, text2, div2, text3, div3, text4;

	var each_value = ctx.degrees;

	var each_blocks = [];

	for (var i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div5 = createElement("div");

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			text0 = createText("\n  ");
			div4 = createElement("div");
			div0 = createElement("div");
			text1 = createText("\n    ");
			div1 = createElement("div");
			text2 = createText("\n    ");
			div2 = createElement("div");
			text3 = createText("\n    ");
			div3 = createElement("div");
			text4 = createText(ctx.value);
			div0.className = "gauge-fill gauge-bg svelte-1w3m8rz";
			div1.className = "gauge-fill svelte-1w3m8rz";
			setStyle(div1, "transform", "rotate(-" + ctx.rotate + "deg)");
			setStyle(div1, "background", bg(ctx.value));
			div2.className = "gauge-white svelte-1w3m8rz";
			div3.className = "gauge-value svelte-1w3m8rz";
			div4.className = "gauge-overflow svelte-1w3m8rz";
			div5.className = "gauge svelte-1w3m8rz";
		},

		m(target, anchor) {
			insert(target, div5, anchor);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div5, null);
			}

			append(div5, text0);
			append(div5, div4);
			append(div4, div0);
			append(div4, text1);
			append(div4, div1);
			append(div4, text2);
			append(div4, div2);
			append(div4, text3);
			append(div4, div3);
			append(div3, text4);
		},

		p(changed, ctx) {
			if (changed.degrees) {
				each_value = ctx.degrees;

				for (var i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(changed, child_ctx);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div5, text0);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}
				each_blocks.length = each_value.length;
			}

			if (changed.rotate) {
				setStyle(div1, "transform", "rotate(-" + ctx.rotate + "deg)");
			}

			if (changed.value) {
				setStyle(div1, "background", bg(ctx.value));
				setData(text4, ctx.value);
			}
		},

		i: noop,
		o: noop,

		d(detach) {
			if (detach) {
				detachNode(div5);
			}

			destroyEach(each_blocks, detach);
		}
	};
}

function bg(pct) {
  if (pct < 50) {
    // 0 => 0
    // 25 => 0
    // 50 => 1
    return (
      'rgb(' +
      interpolate(232, 57, pct / 25 - 1) +
      ',' +
      interpolate(82, 125, pct / 25 - 1) +
      ',' +
      interpolate(59, 155, pct / 25 - 1) +
      ')'
    )
  }
  // 50 => 0
  // 90 => 1
  // 100 => 1
  return (
    'rgb(' +
    interpolate(57, 128, pct / 40 - 1.25) +
    ',' +
    interpolate(125, 182, pct / 40 - 1.25) +
    ',' +
    interpolate(155, 46, pct / 40 - 1.25) +
    ')'
  )
  function interpolate(start, end, val) {
    return parseInt((end - start) * Math.min(1, Math.max(0, val)) + start)
  }
}

function instance($$self, $$props, $$invalidate) {
	let { value = 0, arrows = '' } = $$props;

  let rotate;
  let degrees;

	$$self.$set = $$props => {
		if ('value' in $$props) $$invalidate('value', value = $$props.value);
		if ('arrows' in $$props) $$invalidate('arrows', arrows = $$props.arrows);
	};

	$$self.$$.update = ($$dirty = { rotate: 1, value: 1, degrees: 1, arrows: 1 }) => {
		if ($$dirty.rotate || $$dirty.value) {
			rotate = (100 - value) * 1.8; $$invalidate('rotate', rotate);
		}
		if ($$dirty.degrees || $$dirty.arrows) {
			degrees = arrows
        ? String(arrows)
            .split(',')
            .map(a => parseInt(a) * 1.8)
            .filter(a => a > -1)
        : []; $$invalidate('degrees', degrees);
		}
	};

	return { value, arrows, rotate, degrees };
}

class NumberGauge extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1w3m8rz-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal);
	}

	get value() {
		return this.$$.ctx.value;
	}

	set value(value) {
		this.$set({ value });
		flush();
	}

	get arrows() {
		return this.$$.ctx.arrows;
	}

	set arrows(arrows) {
		this.$set({ arrows });
		flush();
	}
}

export default NumberGauge;
