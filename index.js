let { Application, SizeModeEnum } = require('./application');
let { ArrayCollection } = require('./array/array_collection');
let { BoundingBox } = require('./bounding/bounding_box');
let { BoundingSphere } = require('./bounding/bounding_sphere');
let { EventSubscriber } = require('./event/event_subscriber');
let { GfxAnimatedSpriteDrawable } = require('./gfx/gfx_animated_sprite_drawable');
let { GfxDrawable } = require('./gfx/gfx_drawable');
let { GfxJAMDrawable } = require('./gfx/gfx_jam_drawable');
let { GfxJSMDrawable } = require('./gfx/gfx_jsm_drawable');
let { GfxShader } = require('./gfx/gfx_shaders');
let { GfxSpriteDrawable } = require('./gfx/gfx_sprite_drawable');
let { GfxView, ProjectionModeEnum } = require('./gfx/gfx_view');
let { GfxViewport } = require('./gfx/gfx_viewport');
let { InputTypeEnum, KeyEnum } = require('./input/input');
let { IOFilepacker } = require('./io/io_filepacker');
let { IOJSONSerializer } = require('./io/io_json_serializer');
let { Screen } = require('./screen/screen');
let { Texture } = require('./texture/texture');
let { UIBoardWidget } = require('./ui/ui_board_widget');
let { UICollectionMenuWidget } = require('./ui/ui_collection_menu_widget');
let { UIDescListWidget } = require('./ui/ui_desc_list_widget');
let { UIMenuWidget } = require('./ui/ui_menu_widget');
let { UIPromptWidget } = require('./ui/ui_prompt_widget');
let { UIRangeWidget } = require('./ui/ui_range_widget');
let { UISelectMultipleWidget } = require('./ui/ui_select_multiple_widget');
let { UISelectWidget } = require('./ui/ui_select_widget');
let { UISliderWidget } = require('./ui/ui_slider_widget');
let { UISpriteWidget } = require('./ui/ui_sprite_widget');
let { UITextWidget } = require('./ui/ui_text_widget');
let { UIWidget } = require('./ui/ui_widget');
let { UIWindowWidget } = require('./ui/ui_window_widget');
let { Utils } = require('./helpers');

let { gfxManager } = require('./gfx/gfx_manager');
let { inputManager } = require('./input/input_manager');
let { screenManager } = require('./screen/screen_manager');
let { soundManager } = require('./sound/sound_manager');
let { textureManager } = require('./texture/texture_manager');
let { uiManager } = require('./ui/ui_manager');

module.exports.GWE = {
  Application,
  SizeModeEnum,
  ArrayCollection,
  BoundingBox,
  BoundingSphere,
  EventSubscriber,
  GfxAnimatedSpriteDrawable,
  GfxDrawable,
  GfxJSMDrawable,
  GfxJAMDrawable,
  GfxShader,
  GfxSpriteDrawable,
  GfxView,
  ProjectionModeEnum,
  GfxViewport,
  InputTypeEnum,
  KeyEnum,
  IOFilepacker,
  IOJSONSerializer,
  Screen,
  Texture,
  UIBoardWidget,
  UICollectionMenuWidget,
  UIDescListWidget,
  UIMenuWidget,
  UIPromptWidget,
  UIRangeWidget,
  UISelectMultipleWidget,
  UISelectWidget,
  UISliderWidget,
  UISpriteWidget,
  UITextWidget,
  UIWidget,
  UIWindowWidget,
  Utils,
  gfxManager,
  inputManager,
  screenManager,
  soundManager,
  textureManager,
  uiManager
};