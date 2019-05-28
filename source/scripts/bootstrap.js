import { $setVar } from 'wee-store';
import { $setRef } from 'core/dom';
import 'es6-promise/auto';
import '../styles/global.scss';

// Import all component scss files
require.context('../components', true, /\.scss$/);

$setRef();
$setVar();
