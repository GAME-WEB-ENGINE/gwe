let { Application } = require('./application');
let { ArrayCollection } = require('./array/array_collection');
let { BoundingBox } = require('./bounding/bounding_box');
let { BoundingRect } = require('./bounding/bounding_rect');
let { EventSubscriber } = require('./event/event_subscriber');
let { GfxCollisionBox2D } = require('./gfx/gfx_collisionbox_2d');
let { GfxCollisionBox3D } = require('./gfx/gfx_collisionbox_2d');
let { GfxDrawable } = require('./gfx/gfx_drawable');
let { GfxJAMDrawable } = require('./gfx/gfx_jam_drawable');
let { GfxJASDrawable } = require('./gfx/gfx_jas_drawable');
let { GfxJSMDrawable } = require('./gfx/gfx_jsm_drawable');
let { GfxJSSDrawable } = require('./gfx/gfx_jss_drawable');
let { GfxJWMDrawable } = require('./gfx/gfx_jwm_drawable');
let { GfxMover } = require('./gfx/gfx_mover');
let { GfxShader } = require('./gfx/gfx_shaders');
let { GfxView } = require('./gfx/gfx_view');
let { GfxViewport } = require('./gfx/gfx_viewport');
let { KeydownEvent, KeydownOnceEvent, KeyupEvent, MouseButtonDownEvent, MouseButtonUpEvent, MouseDragBeginEvent, MouseDragEvent, MouseDragEndEvent, MouseMoveEvent } = require('./input/input_events');
let { IOFilepacker } = require('./io/io_filepacker');
let { IOJSONSerializer } = require('./io/io_json_serializer');
let { Screen } = require('./screen/screen');
let { ScriptMachine } = require('./script/script_machine');
let { Texture } = require('./texture/texture');
let { UIBubbleWidget } = require('./ui/ui_bubble_widget');
let { UIDescriptionListWidget } = require('./ui/ui_description_list_widget');
let { UIDialogWidget } = require('./ui/ui_dialog_widget');
let { UIInputRangeWidget } = require('./ui/ui_input_range_widget');
let { UIInputSelectWidget } = require('./ui/ui_input_select_widget');
let { UIInputSelectMultipleWidget } = require('./ui/ui_input_select_widget');

let { UIInputSliderWidget } = require('./ui/ui_input_slider_widget');
let { UIInputTextWidget } = require('./ui/ui_input_text_widget');
let { UIKeyboardWidget } = require('./ui/ui_keyboard_widget');
let { UIListViewWidget } = require('./ui/ui_list_view_widget');
let { UIMenuTextWidget } = require('./ui/ui_menu_text_widget');
let { UIMenuWidget } = require('./ui/ui_menu_widget');
let { UIMessageWidget } = require('./ui/ui_message_widget');
let { UIPrintWidget } = require('./ui/ui_print_widget');
let { UIPromptWidget } = require('./ui/ui_prompt_widget');
let { UISpriteWidget } = require('./ui/ui_sprite_widget');
let { UIWidget } = require('./ui/ui_widget');
let { Utils } = require('./helpers');

let { SizeModeEnum } = require('./application');
let { ProjectionModeEnum } = require('./gfx/gfx_view');
let { InputKeyEnum } = require('./input/input_enums');
let { MenuFocusEnum } = require('./ui/ui_menu_widget');

let { gfxManager } = require('./gfx/gfx_manager');
let { eventManager } = require('./event/event_manager');
let { inputManager } = require('./input/input_manager');
let { screenManager } = require('./screen/screen_manager');
let { soundManager } = require('./sound/sound_manager');
let { textureManager } = require('./texture/texture_manager');
let { uiManager } = require('./ui/ui_manager');

module.exports.GWE = {
  Application,
  ArrayCollection,
  BoundingBox,
  BoundingRect,
  EventSubscriber,
  GfxCollisionBox2D,
  GfxCollisionBox3D,
  GfxDrawable,
  GfxJAMDrawable,
  GfxJASDrawable,
  GfxJSMDrawable,
  GfxJSSDrawable,
  GfxJWMDrawable,
  GfxMover,
  GfxShader,
  GfxView,
  GfxViewport,
  KeydownEvent, KeydownOnceEvent, KeyupEvent, MouseButtonDownEvent, MouseButtonUpEvent, MouseDragBeginEvent, MouseDragEvent, MouseDragEndEvent, MouseMoveEvent,
  IOFilepacker,
  IOJSONSerializer,
  Screen,
  ScriptMachine,
  Texture,
  UIBubbleWidget,
  UIDescriptionListWidget,
  UIDialogWidget,
  UIInputRangeWidget,
  UIInputSelectWidget,
  UIInputSelectMultipleWidget,
  UIInputSliderWidget,
  UIInputTextWidget,
  UIKeyboardWidget,
  UIListViewWidget,
  UIMenuTextWidget,
  UIMenuWidget,
  UIMessageWidget,
  UIPrintWidget,
  UIPromptWidget,
  UISpriteWidget,
  UIWidget,
  Utils,
  SizeModeEnum,
  ProjectionModeEnum,
  InputKeyEnum,
  MenuFocusEnum,
  gfxManager,
  eventManager,
  inputManager,
  screenManager,
  soundManager,
  textureManager,
  uiManager
};