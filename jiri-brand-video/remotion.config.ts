import {Config} from '@remotion/cli/config';
// Uses the locally installed headless Chrome when present; delete this line to let Remotion download its own.
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
