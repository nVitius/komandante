import {
  ARG_REQUIRED,
  ARG_OPTIONAL,
  ARG_ARRAY
} from './argument';

import {
  OPT_REQUIRED,
  OPT_OPTIONAL,
  OPT_ARRAY,
  OPT_EMPTY
} from './option';

import Command from './command';
import Loader from './loader';

const Ordre = {
  ARG_REQUIRED,
  ARG_OPTIONAL,
  ARG_ARRAY,

  OPT_REQUIRED,
  OPT_OPTIONAL,
  OPT_ARRAY,
  OPT_EMPTY,

  Command,
  Loader
};

export default Ordre;
