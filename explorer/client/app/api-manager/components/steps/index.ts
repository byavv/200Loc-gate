import {StepPlugins} from './stepPlugins';
import {StepGeneral} from './stepGeneral';
import {StepPreview} from './stepPreview';

export * from './stepGeneral';
export * from './stepPlugins';
export * from './stepPreview';

export var MASTER_STEPS_COMPONENTS = [StepPlugins, StepGeneral, StepPreview];